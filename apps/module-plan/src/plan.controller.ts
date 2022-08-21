import { GridRequest } from '@model/common';
import { Plan } from '@model/plan';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlanSvc } from './plan.service';

@Controller('plans')
export class PlanController {
  constructor(private planSvc: PlanSvc) {}

  @Get('all')
  getAllPlan(): Promise<Plan[]> {
    return this.planSvc.findAll();
  }

  @Get(':id')
  getPlanById(@Param() { id }: { id: string }): Promise<Plan> {
    return this.planSvc.findById(id);
  }

  @Post()
  postPlan(@Body() plan: Plan): Promise<Plan> {
    return this.planSvc.create(plan);
  }

  @Delete('all')
  deleteAllPlan(): Promise<void> {
    return this.planSvc.deleteAll();
  }

  @Post('computeStep/:id')
  computeStep(@Param() { id }: { id: string }): Promise<Plan> {
    return this.planSvc.computeStep(id);
  }

  @Post('request')
  request(@Body() request: GridRequest): Promise<any> {
    return this.planSvc.processRequest(request);
  }
}
