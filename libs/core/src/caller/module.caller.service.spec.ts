import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ModuleCallerSvc } from '@app/core';

describe('Caller service', () => {
  let service: ModuleCallerSvc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ModuleCallerSvc],
    }).compile();

    service = module.get<ModuleCallerSvc>(ModuleCallerSvc);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
