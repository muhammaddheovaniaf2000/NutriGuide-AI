const { sign } = require('jsonwebtoken');
const { comparePassword } = require('../helpers/bcrypt');
const { User } = require('../models');
const { use } = require('../routes');
const { signToken } = require('../helpers/jwt');

class UserController {
    static async register(req, res, next) {
        try {
            const { username, email, password, weight, height, age, gender, goal } = req.body;

            const newUser = await User.create({ username, email, password, weight, height, age, gender, goal })

            res.status(201).json({ 
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    goal: newUser.goal // Mengirim goal balik untuk redirect di react
                }
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async login (req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email) {
                throw { name: 'BadRequest', message: 'Email is required' };
            }

            if (!password) {
                throw { name: 'BadRequest', message: 'Password is required' };
            }


            const user = await User.findOne({ where: { email } });

            if (!user)
                throw { name: 'Unauthorized', message: 'Invalid email or password' };

            const isPasswordValid = comparePassword(password, user.password);
            if (!isPasswordValid)
                throw { name: 'Unauthorized', message: 'Invalid email or password' };

            const accessToken = signToken({ id: user.id, email: user.email });

            res.status(200).json({ accessToken })
        } catch (error) {
            console.log(error);
            next(error);
            
        }
    }
}

  

module.exports = UserController;