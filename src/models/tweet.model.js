import { Sequelize } from "../db/index.js"; // Import Sequelize instance

const Tweet = Sequelize.define("Tweet", {
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  owner: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id',
    },
  },
  videoId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'videos',
      key: 'id',
    },
  },
},
{
  database: 'LEARN',
  timestamps: true,
  tableName: 'tweets'
});

export default Tweet;
