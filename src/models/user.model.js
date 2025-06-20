import { DataTypes } from "sequelize";
import bcrypt from "bcrypt"; //password co enceypt karne ke liye
import jwt from "jsonwebtoken"; //token generate karne ke liye
import { Sequelize } from "../db/index.js";

const User = Sequelize.define("User", //define model and user table name of database
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverImage: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  { 
    database: 'LEARN', //SELECT DATABASE
    timestamps: true 
  }
);

// new user password encrypt
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// Check password encrypt == user
User.prototype.isPasswordCorrect = function (pass) {
  return bcrypt.compare(pass, this.password);
};

//making JWT access token
User.prototype.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

//JWT refresh token
User.prototype.generateRefreshToken = function () {
  return jwt.sign({ id: this.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

Sequelize.models.User; //tell sequlize make model for me
export {User};