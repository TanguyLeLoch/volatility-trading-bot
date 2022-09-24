import { GridRequest } from '@model/common';
import { Plan } from '@model/plan';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PlanSvc } from './plan.service';

@Controller()
export class PlanController {
  constructor(private planSvc: PlanSvc) {}

  @Get('plans/all')
  getAllPlan(): Promise<Plan[]> {
    return this.planSvc.findAll();
  }

  @Get('plans/:id')
  getPlanById(@Param() { id }: { id: string }): Promise<Plan> {
    return this.planSvc.findById(id);
  }

  @Post('plans')
  postPlan(@Body() plan: Plan): Promise<Plan> {
    return this.planSvc.create(plan);
  }

  @Put('plans')
  putPlan(@Body() plan: Plan): Promise<Plan> {
    return this.planSvc.modify(plan);
  }

  @Delete('plans/all')
  deleteAllPlan(): Promise<void> {
    return this.planSvc.deleteAll();
  }

  @Post('plans/computeStep/:id')
  computeStep(@Param() { id }: { id: string }): Promise<Plan> {
    return this.planSvc.computeStep(id);
  }

  @Post('request')
  request(@Body() request: GridRequest): Promise<any> {
    return this.planSvc.processRequest(request);
  }
}
