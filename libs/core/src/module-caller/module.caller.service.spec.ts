import { Test, TestingModule } from '@nestjs/testing';
import { ModuleCallerSvc } from './module.caller.service';

describe('CoreService', () => {
  let service: ModuleCallerSvc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModuleCallerSvc],
    }).compile();

    service = module.get<ModuleCallerSvc>(ModuleCallerSvc);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
