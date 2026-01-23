const { comparePassword } = require('../helpers/bcrypt');
const { User } = require('../models');
const { signToken } = require('../helpers/jwt');

class UserController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            const newUser = await User.create({ 
                username, 
                email, 
                password 
            });

            res.status(201).json({ 
                message: "User created successfully",
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email
                }
            });
        } catch (error) {
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


    static async showProfile(req, res, next) {
        try {
          // req.user.id didapat dari middleware authentication
          const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
          });
    
          if (!user) throw { name: 'NotFound', message: 'User not found' };
    
          res.status(200).json(user);
        } catch (error) {
          next(error);
        }
      }



      static async updateProfile(req, res, next) {
        try {
            const { username, email, gender, age } = req.body;
    
            const user = await User.findByPk(req.user.id);
            if (!user) throw { name: 'NotFound', message: 'User not found' };
    
            await user.update({ 
                username, 
                email, 
                gender, 
                age 
            });
    
            res.status(200).json({ 
                message: "Profile updated successfully",
                user: {
                    username: user.username,
                    email: user.email,
                    gender: user.gender,
                    age: user.age
                }
            });
        } catch (error) {
            next(error);
        }
    }


}

  

module.exports = UserController;