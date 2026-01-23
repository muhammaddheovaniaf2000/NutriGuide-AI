const request = require('supertest');
const app = require('../app');
const { User, Favorite, sequelize } = require('../models');
const { signToken } = require('../helpers/jwt');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Favorite.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

describe('POST /favorites', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    userId = user.id;
    token = signToken({ id: user.id, email: user.email });
  });

  it('should add favorite successfully (201)', async () => {
    const response = await request(app)
      .post('/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        recipeId: '716429',
        title: 'Pasta Carbonara',
        image: 'https://example.com/image.jpg'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Recipe added to favorites');
  });

  it('should return 400 if recipeId is missing', async () => {
    const response = await request(app)
      .post('/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Pasta' });

    expect(response.status).toBe(400);
  });

  it('should return 400 if recipe already in favorites', async () => {
    await Favorite.create({ UserId: userId, RecipeId: '716429', title: 'Pasta' });

    const response = await request(app)
      .post('/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipeId: '716429', title: 'Pasta' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Recipe already in favorites');
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app)
      .post('/favorites')
      .send({ recipeId: '716429' });

    expect(response.status).toBe(401);
  });
});

describe('GET /favorites', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    userId = user.id;
    token = signToken({ id: user.id, email: user.email });
  });

  it('should get all favorites successfully (200)', async () => {
    await Favorite.create({ UserId: userId, RecipeId: '716429', title: 'Pasta' });
    await Favorite.create({ UserId: userId, RecipeId: '716430', title: 'Pizza' });

    const response = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('should return empty array if no favorites', async () => {
    const response = await request(app)
      .get('/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app).get('/favorites');

    expect(response.status).toBe(401);
  });
});

describe('DELETE /favorites/:id', () => {
  let token;
  let userId;
  let favoriteId;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    userId = user.id;
    token = signToken({ id: user.id, email: user.email });

    const favorite = await Favorite.create({ UserId: userId, RecipeId: '716429', title: 'Pasta' });
    favoriteId = favorite.id;
  });

  it('should delete favorite successfully (200)', async () => {
    const response = await request(app)
      .delete(`/favorites/${favoriteId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
  });

  it('should return 404 if favorite not found', async () => {
    const response = await request(app)
      .delete('/favorites/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Favorite record not found');
  });

  it('should return 404 if trying to delete another user\'s favorite', async () => {
    const otherUser = await User.create({ username: 'other', email: 'other@example.com', password: 'password123' });
    const otherToken = signToken({ id: otherUser.id, email: otherUser.email });

    const response = await request(app)
      .delete(`/favorites/${favoriteId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Favorite record not found');
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app).delete(`/favorites/${favoriteId}`);

    expect(response.status).toBe(401);
  });
});