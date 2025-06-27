// src/models/associateModels.js
import { User } from "./user.model.js";
import Video from "./video.model.js";

// Define associations
User.hasMany(Video, { as: "videos", foreignKey: "ownerId" });
Video.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
