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

describe('POST /register', () => {
  it('should register a new user successfully (201)', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body.user).toHaveProperty('username', 'testuser');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should return 400 if username is empty', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: '', email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username required');
  });

  it('should return 400 if email is empty or invalid', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', email: '', password: 'password123' });

    expect(response.status).toBe(400);
    // Empty email triggers invalid format validation
    expect(response.body).toHaveProperty('message');
  });

  it('should return 400 if password is empty', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', email: 'test@example.com', password: '' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Password required');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', email: 'invalidemail', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid email format');
  });

  it('should return 400 if email already exists', async () => {
    await User.create({ username: 'existing', email: 'existing@example.com', password: 'password123' });

    const response = await request(app)
      .post('/register')
      .send({ username: 'newuser', email: 'existing@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email address already exists!');
  });
});

describe('POST /login', () => {
  beforeEach(async () => {
    await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
  });

  it('should login successfully (200)', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should return 400 if email is missing', async () => {
    const response = await request(app)
      .post('/login')
      .send({ password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email is required');
  });

  it('should return 400 if password is missing', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Password is required');
  });

  it('should return 401 with wrong email', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'wrong@example.com', password: 'password123' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should return 401 with wrong password', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });
});

describe('GET /profiles', () => {
  let token;
  let userId;
  
  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    userId = user.id;
    token = signToken({ id: user.id, email: user.email });
  });

  it('should get profile successfully (200)', async () => {
    const response = await request(app)
      .get('/profiles')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app).get('/profiles');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Please login first');
  });

  it('should return 401 with invalid token', async () => {
    const response = await request(app)
      .get('/profiles')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid Token');
  });

  it('should return 401 if user not found', async () => {
    const fakeToken = signToken({ id: 99999, email: 'fake@example.com' });
    
    const response = await request(app)
      .get('/profiles')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(response.status).toBe(401);
  });
});

describe('PUT /profiles', () => {
  let token;
  
  beforeEach(async () => {
    const user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    token = signToken({ id: user.id, email: user.email });
  });

  it('should update profile successfully (200)', async () => {
    const response = await request(app)
      .put('/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'updated', email: 'updated@example.com', gender: 'Male', age: 30 });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Profile updated successfully');
    expect(response.body.user).toHaveProperty('username', 'updated');
  });

  it('should return 401 if no token provided', async () => {
    const response = await request(app)
      .put('/profiles')
      .send({ username: 'updated' });

    expect(response.status).toBe(401);
  });
});