import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan } from '@model/plan';
import { Method, ModuleCallerSvc } from '@app/core';

@Injectable()
export class PlanSvc {
  constructor(
    @InjectModel('Plan') private readonly planModel: Model<Plan>,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async findById(id: string): Promise<Plan> {
    return this.planModel.findById(id).exec();
  }

  async create(plan: Plan): Promise<Plan> {
    if (plan.computedSteps === undefined) {
      plan.computedSteps = [];
    }
    const planToCreate = new this.planModel(plan);
    const createdPlan = await planToCreate.save();
    this.moduleCallerSvc.callModule('brain', Method.POST, 'init', createdPlan);
    return createdPlan;
  }

  async computeStep(id: string): Promise<Plan> {
    const plan = await this.planModel.findById(id).exec();
    let moneyLeft = plan.startAmount;
    plan.computedSteps.push(plan.priceMin);

    while (moneyLeft > plan.amountPerStep) {
      const lastStep = plan.computedSteps.at(-1);
      plan.computedSteps.push(lastStep * (1 + plan.step / 100));
      moneyLeft -= plan.amountPerStep;
    }
    //save updated plan
    const updatedPlan = await this.planModel
      .findByIdAndUpdate(id, plan, { new: true })
      .exec();

    return updatedPlan;
  }
}
