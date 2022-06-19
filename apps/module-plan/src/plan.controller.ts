import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { Plan } from '@model/plan';
import { PlanSvc } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private planrSvc: PlanSvc) {}

  @Get(':id')
  getPlanById(@Param() { id }: { id: string }): Promise<Plan> {
    return this.planrSvc.findById(id);
  }

  @Post()
  postPlan(@Body() plan: Plan): Promise<Plan> {
    return this.planrSvc.create(plan);
  }

  @Post('computeStep/:id')
  computeStep(@Param() { id }: { id: string }): Promise<Plan> {
    return this.planrSvc.computeStep(id);
  }
}
