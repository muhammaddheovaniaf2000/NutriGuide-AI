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

describe('GET /pub/recipes - Public Recipe Search', () => {
  it('should search recipes without authentication (200)', async () => {
    const response = await request(app)
      .get('/pub/recipes')
      .query({ query: 'pasta' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe('GET /pub/recipes/:id - Public Recipe Detail', () => {
  it('should get recipe detail without authentication (200)', async () => {
    const response = await request(app)
      .get('/pub/recipes/716429');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});

describe('GET /recipes - Protected Recipe Search', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    token = signToken({ id: user.id, email: user.email });
  });

  it('should search recipes with authentication (200)', async () => {
    const response = await request(app)
      .get('/recipes')
      .set('Authorization', `Bearer ${token}`)
      .query({ query: 'pasta' });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app)
      .get('/recipes')
      .query({ query: 'pasta' });

    expect(response.status).toBe(401);
  });
});

describe('GET /recipes/:id - Protected Recipe Detail', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    token = signToken({ id: user.id, email: user.email });
  });

  it('should get recipe detail with authentication (200)', async () => {
    const response = await request(app)
      .get('/recipes/716429')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app)
      .get('/recipes/716429');

    expect(response.status).toBe(401);
  });
});
