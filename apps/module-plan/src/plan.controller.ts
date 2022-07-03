import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Plan } from '@model/plan';
import { PlanSvc } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private planrSvc: PlanSvc) {}

  @Get('all')
  getAllPlan(): Promise<Plan[]> {
    return this.planrSvc.findAll();
  }

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
  @Delete('all')
  deleteAllPlan(): Promise<void> {
    return this.planrSvc.deleteAll();
  }
}
