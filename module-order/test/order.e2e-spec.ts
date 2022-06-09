import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Order } from 'module-order-model/order';
import { Status } from 'module-order-model/order.status';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  let order: Order;
  it('/orders (POST)', async () => {
    const res = await request(app.getHttpServer()).post('/orders').send({
      token1: 'DOGE_TEST',
      token2: 'USDT',
      quantity: 2,
      status: 'OPEN',
    });
    order = res.body;
    expect(res.status).toBe(201);
    expect(order._id).toBeDefined();
    expect(order.token1).toBe('DOGE_TEST');
    expect(order.token2).toBe('USDT');
    expect(order.quantity).toBe(2);
    expect(order.status).toBe('OPEN');
    expect(order.__v).toBe(0);
  });
  it('/orders (PUT)', async () => {
    const orderPut = order;
    orderPut.status = Status.FILLED;

    const res = await request(app.getHttpServer())
      .put('/orders')
      .send(orderPut);
    order = res.body;
    expect(res.status).toBe(200);
    expect(order._id).toBeDefined();
    expect(order.token1).toBe('DOGE_TEST');
    expect(order.token2).toBe('USDT');
    expect(order.quantity).toBe(2);
    expect(order.status).toBe('FILLED');
    expect(order.__v).toBe(0);
  });
  it('/orders (GET)', async () => {
    const res = await request(app.getHttpServer()).get(`/orders/${order._id}`);
    order = res.body;
    expect(res.status).toBe(200);
    expect(order._id).toBeDefined();
    expect(order.token1).toBe('DOGE_TEST');
    expect(order.token2).toBe('USDT');
    expect(order.quantity).toBe(2);
    expect(order.status).toBe('FILLED');
    expect(order.__v).toBe(0);
  });
  it('/orders (DELETE)', async () => {
    const res = await request(app.getHttpServer()).delete(
      `/orders/${order._id}`,
    );
    order = res.body;
    expect(res.status).toBe(200);
    expect(order._id).toBeDefined();
    expect(order.token1).toBe('DOGE_TEST');
    expect(order.token2).toBe('USDT');
    expect(order.quantity).toBe(2);
    expect(order.status).toBe('FILLED');
    expect(order.__v).toBe(0);
  });
  it('/orders (GET) (checkDelete)', async () => {
    const res = await request(app.getHttpServer()).get(`/orders/${order._id}`);
    order = res.body;
    expect(res.status).toBe(200);
    expect(order).toEqual({});
  });

  afterAll(async () => {
    await app.close();
  });
});
