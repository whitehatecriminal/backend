import { Sequelize } from "../db";
import { User } from "./user.model.js";

const Like = Sequelize.define("Like", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  videoId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "videos",
      key: "id",
    },
  },
});

export default Like;
