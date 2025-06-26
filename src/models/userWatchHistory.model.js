import { DataTypes } from "sequelize";
import { Sequelize } from "../db/index.js";

const UserWatchHistory = Sequelize.define("UserWatchHistory", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: false
});

export default UserWatchHistory;
