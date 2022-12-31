import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ModuleCustomerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/customers (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .send({ name: 'John', email: 'john@example.com', password: '123Soleil' })
      .expect(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'John');
    expect(response.body).toHaveProperty('email', 'john@example.com');
    expect(response.body).not.toHaveProperty('password');
  });
  it('/login (POST)', async () => {
    await request(app.getHttpServer())
      .post('/customers')
      .send({ name: 'John', email: 'john2@example.com', password: '123Soleil' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/customers/login')
      .send({ email: 'john2@example.com', password: '123Soleil' })
      .expect(201);
    expect(response.body).toHaveProperty('token');
  });
  it('/login fail (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers/login')
      .send({ email: 'john3@example.com', password: '123Soleil' })
      .expect(403);
    expect(response.body).toHaveProperty('message', 'Customer not found');
  });

  // teardown
  afterAll(async () => {
    await app.close();
  });
});