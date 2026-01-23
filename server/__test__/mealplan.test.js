const request = require('supertest');
const app = require('../app');
const { User, MealPlan, sequelize } = require('../models');
const { signToken } = require('../helpers/jwt');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await MealPlan.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });
});

describe('POST /mealplans', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    userId = user.id;
    token = signToken({ id: user.id, email: user.email });
  });

  it('should create meal plan successfully (201)', async () => {
    const response = await request(app)
      .post('/mealplans')
      .set('Authorization', `Bearer ${token}`)
      .send({
        recipeId: '716429',
        date: '2026-01-25',
        meal_time: 'Breakfast'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Meal plan created successfully');
  });

  it('should return 400 if recipeId is missing', async () => {
    const response = await request(app)
      .post('/mealplans')
      .set('Authorization', `Bearer ${token}`)
      .send({ date: '2026-01-25', meal_time: 'Breakfast' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Recipe ID, date, and meal time are required');
  });

  it('should return 400 if date is missing', async () => {
    const response = await request(app)
      .post('/mealplans')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipeId: '716429', meal_time: 'Breakfast' });

    expect(response.status).toBe(400);
  });

  it('should return 400 if meal_time is missing', async () => {
    const response = await request(app)
      .post('/mealplans')
      .set('Authorization', `Bearer ${token}`)
      .send({ recipeId: '716429', date: '2026-01-25' });

    expect(response.status).toBe(400);
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app)
      .post('/mealplans')
      .send({ recipeId: '716429', date: '2026-01-25', meal_time: 'Breakfast' });

    expect(response.status).toBe(401);
  });
});

describe('GET /mealplans', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    userId = user.id;
    token = signToken({ id: user.id, email: user.email });
  });

  it('should get all meal plans successfully (200)', async () => {
    await MealPlan.create({ UserId: userId, RecipeId: '716429', date: '2026-01-25', meal_time: 'Breakfast' });
    await MealPlan.create({ UserId: userId, RecipeId: '716430', date: '2026-01-25', meal_time: 'Lunch' });

    const response = await request(app)
      .get('/mealplans')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });

  it('should return empty array if no meal plans', async () => {
    const response = await request(app)
      .get('/mealplans')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app).get('/mealplans');

    expect(response.status).toBe(401);
  });
});

describe('DELETE /mealplans/:id', () => {
  let token;
  let userId;
  let mealPlanId;

  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    userId = user.id;
    token = signToken({ id: user.id, email: user.email });

    const mealPlan = await MealPlan.create({ UserId: userId, RecipeId: '716429', date: '2026-01-25', meal_time: 'Breakfast' });
    mealPlanId = mealPlan.id;
  });

  it('should delete meal plan successfully (200)', async () => {
    const response = await request(app)
      .delete(`/mealplans/${mealPlanId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Meal plan removed successfully');
  });

  it('should return 404 if meal plan not found', async () => {
    const response = await request(app)
      .delete('/mealplans/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Meal plan not found');
  });

  it('should return 404 if trying to delete another user\'s meal plan', async () => {
    const otherUser = await User.create({ username: 'other', email: 'other@example.com', password: 'password123' });
    const otherToken = signToken({ id: otherUser.id, email: otherUser.email });

    const response = await request(app)
      .delete(`/mealplans/${mealPlanId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Meal plan not found');
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app).delete(`/mealplans/${mealPlanId}`);

    expect(response.status).toBe(401);
  });
});