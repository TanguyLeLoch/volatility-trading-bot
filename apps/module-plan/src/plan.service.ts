import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { Balance } from '@model/balance';
import { GridRequest, Pair, RecomputeStepRequest } from '@model/common';
import { Plan } from '@model/plan';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import winston from 'winston';
import { moduleName } from './module.info';

@Injectable()
export class PlanSvc {
  private static readonly logger: winston.Logger = createCustomLogger(moduleName, PlanSvc.name);

  constructor(
    @InjectModel('Plan') private readonly planModel: Model<Plan>,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async findById(id: string): Promise<Plan> {
    return this.planModel.findById(id).exec();
  }

  async create(plan: Plan): Promise<Plan> {
    PlanSvc.logger.info(`Creating plan ${new Pair(plan.pair).toString()}`);

    if (plan.stepLevels === undefined) {
      plan.stepLevels = [];
    }
    const planToCreate = new this.planModel(plan);
    return await planToCreate.save();
  }

  async computeStep(id: string): Promise<Plan> {
    const plan = await this.planModel.findById(id).exec();
    let moneyLeft = plan.startAmount;
    // reinit step levels
    plan.stepLevels = [];
    plan.stepLevels.push(plan.priceMin);

    while (moneyLeft >= plan.amountPerStep) {
      const lastStep = plan.stepLevels.at(-1);
      plan.stepLevels.push(lastStep * (1 + plan.step / 100));
      moneyLeft -= plan.amountPerStep;
    }
    plan.stepLevels = PlanSvc.roundPrice(plan.stepLevels, 3);
    //save updated plan
    return await this.planModel.findByIdAndUpdate(id, plan, { new: true }).exec();
  }

  async findAll(): Promise<Plan[]> {
    return this.planModel.find().exec();
  }

  async modify(plan: Plan): Promise<Plan> {
    return this.planModel.findByIdAndUpdate(plan._id, plan, { new: true }).exec();
  }

  async deleteAll(): Promise<void> {
    await this.planModel.deleteMany({}).exec();
  }

  async deleteById(id: string): Promise<Plan> {
    return this.planModel.findByIdAndDelete(id).exec();
  }

  async processRequest(request: GridRequest): Promise<any> {
    switch (request.name) {
      case 'recomputeStep':
        return this.processRecomputeStepRequest(request as RecomputeStepRequest);
      default:
        throw new Error(`Unknown request name ${request.name}`);
    }
  }

  async processRecomputeStepRequest(request: RecomputeStepRequest): Promise<Plan> {
    const plan: Plan = await this.findById(request.planId);
    const balance: Balance = await this.moduleCallerSvc.callBalanceModule(
      Method.GET,
      `balances/token/${request.pair.token1}/platform/${plan.platform}`,
    );
    const tokensLeft = balance.available;
    PlanSvc.logger.debug(`Tokens left ${tokensLeft}`);

    const newStepLevels: Array<number> = PlanSvc.recomputeStep(tokensLeft, plan);
    if (plan.stepLevels.length === newStepLevels.length) {
      PlanSvc.logger.info(`Cannot increase ceiling because there is not enough token`);
      return plan;
    }
    plan.stepLevels = newStepLevels;
    return await this.modify(plan);
  }

  public static isClose(nextStep: number, step: number): boolean {
    const diff = Math.abs(nextStep - step);
    return diff / nextStep < 0.01;
  }

  public static recomputeStep(tokensLeft: number, plan: Plan): Array<number> {
    const newStepLevels = [];
    newStepLevels.push(plan.priceMin);
    while (true) {
      const lastStep = newStepLevels.at(-1);
      const nextStep = lastStep * (1 + plan.step / 100);
      if (PlanSvc.isClose(nextStep, plan.stepLevels[newStepLevels.length])) {
        newStepLevels.push(nextStep);
        continue;
      }
      const amountToken = plan.amountPerStep / nextStep;
      if (tokensLeft > amountToken) {
        newStepLevels.push(nextStep);
        tokensLeft -= amountToken;
      } else {
        break;
      }
    }
    return PlanSvc.roundPrice(newStepLevels, 3);
  }

  public static roundPrice(steps: number[], nbMaxDecimal: number): number[] {
    const minStep = steps[0];
    const nbFigure = Math.floor(Math.log10(minStep));

    const nbDecimal = nbMaxDecimal - Math.floor(nbFigure / 2);
    return steps.map((step) => Math.round(step * Math.pow(10, nbDecimal)) / Math.pow(10, nbDecimal));
  }
}
