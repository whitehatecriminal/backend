import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/database.js";

const Video = sequelize.define(
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
        model: 'Users',
        key: 'id'
      }
    }
  },
  { 
    database: 'LEARN',
    timestamps: true }
);

Video.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

Sequelize.models.Video;

export default Video;