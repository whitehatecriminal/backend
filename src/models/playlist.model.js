import { Sequelize } from "../db/index.js"; // Import Sequelize instance
import { User } from "./user.model.js"; // Import User model
import Video from "./video.model.js";

const Playlist = Sequelize.define("Playlist", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  Video: [{
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Video,
      key: 'id',
    },
  }],
  owner: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
},
{
  database: 'LEARN', // SELECT DATABASE
  timestamps: true, // Automatically manage createdAt and updatedAt fields
  tableName: 'playlists'
});

export default Playlist;
