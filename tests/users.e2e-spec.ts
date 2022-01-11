import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
  const { app } = await boot;

  application = app;
});

describe('Users e2e', () => {
  it('Register - error', async () => {
    const { statusCode } = await request(application.app)
      .post('/users/register')
      .send({ email: 'email@email.email', password: '1' });

    expect(statusCode).toBe(422);
  });

  it('Login - success', async () => {
    const { body } = await request(application.app)
      .post('/users/login')
      .send({ email: 'email@email.email', password: '12345' });

    expect(body.jwt).not.toBeUndefined();
  });

  it('Login - error', async () => {
    const { statusCode } = await request(application.app)
      .post('/users/login')
      .send({ email: 'email@email.email', password: '1' });

    expect(statusCode).toBe(401);
  });

  it('Info - success', async () => {
    const login = await request(application.app)
      .post('/users/login')
      .send({ email: 'email@email.email', password: '12345' });
    const { body } = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer ${login.body.jwt}`);

    expect(body.email).toBe('email@email.email');
  });

  it('Info - error', async () => {
    const { statusCode } = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer 1`);

    expect(statusCode).toBe(401);
  });
});

afterAll(() => {
  application.close();
});
