import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ExternalCallerSvc } from './external.caller.service';

describe('CoreSvc', () => {
  let service: ExternalCallerSvc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExternalCallerSvc],
    }).compile();

    service = module.get<ExternalCallerSvc>(ExternalCallerSvc);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
