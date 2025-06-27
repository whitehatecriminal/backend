import { DataTypes } from "sequelize";
import { Sequelize } from "../db/index.js";
import { User } from "./user.model.js";

const Video = Sequelize.define(
  "Video",
  {
    videoFile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: false 
    },
    duration: {
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    views: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    isPublished: { 
        type: DataTypes.BOOLEAN, 
        defaultValue: true 
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  { 
    database: 'LEARN',
    timestamps: true }
);




export default Video;