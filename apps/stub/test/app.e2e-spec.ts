import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StubModule } from './../src/stub.module';

describe('StubController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StubModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
