import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderSvc } from '../service/order.service';

const mockOrderSvc = {
  findAll: jest.fn(),
};

describe('AppController', () => {
  let orderController: OrderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderSvc,
          useValue: mockOrderSvc,
        },
      ],
    }).compile();

    orderController = app.get<OrderController>(OrderController);
  });
  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });
  describe('get orders', () => {
    it('should return a list of order', () => {
      orderController.getOrders();
      expect(mockOrderSvc.findAll).toHaveBeenCalled();
    });
  });
});
