const request = require('supertest');
const app = require('../app');
const { User, sequelize } = require('../models');
const { signToken } = require('../helpers/jwt');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

describe('POST /ai/recommendation', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    token = signToken({ id: user.id, email: user.email });
  });

  it('should return 400 if health metrics are incomplete', async () => {
    const response = await request(app)
      .post('/ai/recommendation')
      .set('Authorization', `Bearer ${token}`)
      .send({ weight: 70 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Health metrics form must be fully completed');
  });

  it('should return 400 if message is missing in chat', async () => {
    const response = await request(app)
      .post('/ai/chat')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Message is required');
  });
});