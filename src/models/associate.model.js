// src/models/associateModels.js
import { User } from "./user.model.js";
import Video from "./video.model.js";
import UserWatchHistory from "./userWatchHistory.model.js"
import { Subscription } from "./subscription.models.js";

// Define associations
User.hasMany(Video, { as: "videos", foreignKey: "ownerId" });
Video.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Subscription, { as: "subscribers", foreignKey: "channel" });
User.hasMany(Subscription, { as: "subscribedTo", foreignKey: "subscriber" });
Subscription.belongsTo(User, { as: "channelDetails", foreignKey: "channel" });
Subscription.belongsTo(User, { as: "subscriberDetails", foreignKey: "subscriber" });

// user videohistory
User.belongsToMany(Video, {
  through: UserWatchHistory,
  foreignKey: "userId",
  otherKey: "videoId",
  as: "watchHistory" // 👈 this alias is important
});

Video.belongsToMany(User, {
  through: UserWatchHistory,
  foreignKey: "videoId",
  otherKey: "userId",
  as: "viewers"
});