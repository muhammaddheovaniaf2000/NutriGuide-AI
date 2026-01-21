'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.MealPlan, { foreignKey: 'UserId' });
      User.belongsToMany(models.Recipe, { through: models.Favorite, foreignKey: 'UserId', otherKey: 'RecipeId' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username required"
        },
        notNull: {
          msg: "Username required"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email address already exists!"
      },
      validate: {
        isEmail: {
          msg: "Invalid email format"
        },
        notEmpty: {
          msg: "Email required"
        },
        notNull: {
          msg: "Email required"
        } 
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password required"
        },
        notNull: {
          msg: "Password required"
        }
      }
    },
    weight: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Weight required"
        },
        notNull: {
          msg: "Weight required"
        },
        isInt: {
          msg: "Weight must be a number"
        },
        min: {
          args: [1],
          msg: "Weight must be greater than 0"
        }
      }
    },
    height: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Height required"
        },
        notNull: {
          msg: "Height required"
        },
        isInt: {
          msg: "Height must be a number"
        },
        min: {
          args: [1],
          msg: "Height must be greater than 0"
        }
      }
    },
    age: {
      type:DataTypes.INTEGER,
      allowNull: false, 
      validate: {
        notEmpty: {
          msg: "Age required"
        },
        notNull: {
          msg: "Age required"
        },
        min: {
          args: [1],
          msg: "Age must be greater than 0"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { 
          msg: "Gender required" 
        },
        notNull: { 
          msg: "Gender required" 
        },
        isIn: {
          args: [['Male', 'Female']],
          msg: "Gender must be Male or Female"
        }
      }
    },
    goal: {
      type: DataTypes.STRING, // UBAH DARI INTEGER KE STRING
      allowNull: false,
      validate: {
        notEmpty: { msg: "Goal required" },
        notNull: { msg: "Goal required" },
        isIn: {
          args: [['Weight Loss', 'Weight Gain', 'Maintain Weight']],
          msg: "Goal must be Weight Loss, Weight Gain, or Maintain Weight"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashPassword(user.password);
  })
  return User;
};