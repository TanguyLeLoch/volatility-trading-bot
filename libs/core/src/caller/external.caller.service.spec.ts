import { Test, TestingModule } from '@nestjs/testing';
import { ExternalCallerSvc } from './external.caller.service';

describe('CoreService', () => {
  let service: ExternalCallerSvc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalCallerSvc],
    }).compile();

    service = module.get<ExternalCallerSvc>(ExternalCallerSvc);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
