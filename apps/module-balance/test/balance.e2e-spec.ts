import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  let balance;
  it('/balances (POST)', async () => {
    const res = await request(app.getHttpServer()).post('/balances').send({
      token: 'DOGE_TEST',
      platform: 'MEXC',
      balance: 0.01,
      inOrder: 0.02,
      available: 0.03,
    });
    balance = res.body;
    expect(res.status).toBe(201);
    expect(balance._id).toBeDefined();
    expect(balance.token).toBe('DOGE_TEST');
    expect(balance.balance).toBe(0.01);
    expect(balance.inOrder).toBe(0.02);
    expect(balance.available).toBe(0.03);
    expect(balance.__v).toBe(0);
  });
  it('/balances (PUT)', async () => {
    const balancePut = balance;
    balancePut.balance += 10;
    balancePut.inOrder += 10;
    balancePut.available += 10;
    const res = await request(app.getHttpServer()).put('/balances').send(balancePut);
    balance = res.body;
    expect(res.status).toBe(200);
    expect(balance._id).toBeDefined();
    expect(balance.token).toBe('DOGE_TEST');
    expect(balance.balance).toBe(10.01);
    expect(balance.inOrder).toBe(10.02);
    expect(balance.available).toBe(10.03);
    expect(balance.__v).toBe(0);
  });
  it('/balances (GET)', async () => {
    const res = await request(app.getHttpServer()).get(`/balances/${balance._id}`);
    balance = res.body;
    expect(res.status).toBe(200);
    expect(balance._id).toBeDefined();
    expect(balance.token).toBe('DOGE_TEST');
    expect(balance.balance).toBe(10.01);
    expect(balance.inOrder).toBe(10.02);
    expect(balance.available).toBe(10.03);
    expect(balance.__v).toBe(0);
  });
  it('/balances (DELETE)', async () => {
    const res = await request(app.getHttpServer()).delete(`/balances/${balance._id}`);
    balance = res.body;
    expect(res.status).toBe(200);
    expect(balance._id).toBeDefined();
    expect(balance.token).toBe('DOGE_TEST');
    expect(balance.balance).toBe(10.01);
    expect(balance.inOrder).toBe(10.02);
    expect(balance.available).toBe(10.03);
    expect(balance.__v).toBe(0);
  });
  it('/balances (GET) (checkDelete)', async () => {
    const res = await request(app.getHttpServer()).get(`/balances/${balance._id}`);
    balance = res.body;
    expect(res.status).toBe(200);
    expect(balance).toEqual({});
  });

  afterAll(async () => {
    await app.close();
  });
});
