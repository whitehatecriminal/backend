import { DataTypes } from "sequelize";
import { Sequelize } from "../db/index.js";
import { User } from "./user.model.js";

const Subscription = Sequelize.define("Subscription",
    {
        subscriber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            },
        },

        channel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        }
    }, {
        timestamps: true
    }
)

export { Subscription }