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
  private readonly logger: winston.Logger = createCustomLogger(moduleName, PlanSvc.name);
  constructor(
    @InjectModel('Plan') private readonly planModel: Model<Plan>,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async findById(id: string): Promise<Plan> {
    return this.planModel.findById(id).exec();
  }

  async create(plan: Plan): Promise<Plan> {
    this.logger.info(`Creating plan ${new Pair(plan.pair).toString()}`);

    if (plan.stepLevels === undefined) {
      plan.stepLevels = [];
    }
    const planToCreate = new this.planModel(plan);
    const createdPlan = await planToCreate.save();
    return createdPlan;
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
    // round prices to 3 decimals
    plan.stepLevels = plan.stepLevels.map((step) => Math.round(step * 1000) / 1000);
    //save updated plan
    const updatedPlan = await this.planModel.findByIdAndUpdate(id, plan, { new: true }).exec();

    return updatedPlan;
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
  async processRequest(request: GridRequest): Promise<any> {
    switch (request.name) {
      case 'recomputeStep':
        return this.recomputeStep(request as RecomputeStepRequest);
      default:
        throw new Error(`Unknown request name ${request.name}`);
    }
  }
  async recomputeStep(request: RecomputeStepRequest): Promise<Plan> {
    const plan: Plan = await this.findById(request.planId);
    const balance: Balance = await this.moduleCallerSvc.callModule(
      'balance',
      Method.GET,
      `balances/token/${request.pair.token1}/platform/${plan.platform}`,
    );
    let tokensLeft = balance.available;
    const newStepLevels = [];
    newStepLevels.push(plan.priceMin);
    while (true) {
      const lastStep = newStepLevels.at(-1);
      const nextStep = lastStep * (1 + plan.step / 100);
      if (isCloseToExistingStep(nextStep, plan.stepLevels)) {
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
    if (plan.stepLevels.length === newStepLevels.length) {
      return plan;
    }
    // round prices to 3 decimals
    plan.stepLevels = newStepLevels.map((step) => Math.round(step * 1000) / 1000);
    return await this.modify(plan);
  }
}
export function isCloseToExistingStep(nextStep: number, stepLevels: number[]) {
  return stepLevels.some((step) => Math.abs(step - nextStep) <= 0.001);
}
