import { Test, TestingModule } from '@nestjs/testing';
import { ModuleBrainController } from './module-brain.controller';
import { ModuleBrainService } from './module-brain.service';

describe('ModuleBrainController', () => {
  let moduleBrainController: ModuleBrainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ModuleBrainController],
      providers: [ModuleBrainService],
    }).compile();

    moduleBrainController = app.get<ModuleBrainController>(
      ModuleBrainController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(moduleBrainController.getHello()).toBe('Hello World!');
    });
  });
});
