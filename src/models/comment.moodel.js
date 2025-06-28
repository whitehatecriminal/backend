import { Sequelize } from "../db/index.js";
import { User } from "./user.model.js";


const Comment = Sequelize.define("Comment", {
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  owner: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  videoId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'videos', // Assuming the videos table is named 'videos'
      key: 'id',
    },
  },
},
{
  database: 'LEARN', // SELECT DATABASE
  timestamps: true, // Automatically manage createdAt and updatedAt fields
  tableName: 'comments'
});

export default Comment;
