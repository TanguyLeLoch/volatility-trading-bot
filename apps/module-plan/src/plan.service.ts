import { createCustomLogger, ModuleCallerSvc } from '@app/core';
import { Pair } from '@model/common';
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
    // this.moduleCallerSvc.callModule('brain', Method.POST, 'init', createdPlan);
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
  async deleteAll(): Promise<void> {
    await this.planModel.deleteMany({}).exec();
  }
}
