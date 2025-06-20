import mysql from "mysql2/promise";
import { DB_NAME } from "../constants.js";
import { Sequelize as SequelizeLib } from "sequelize";

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: DB_NAME,
    });
    console.log(`\n MySQL connected !! DB HOST: ${connection.config.host}`);
    return connection;
  } catch (error) {
    console.error("SQL Connection FAILD: ", error);
    process.exit(1);
  }
};

// model connect to database
const Sequelize = new SequelizeLib(
  DB_NAME, // giving database name
  process.env.MYSQL_USER, //Giving who is using this root or admin
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql' //Tell what database i use
  }
);

// call when all models are define and db is ready
Sequelize.sync({alter: true})
  .then(() => console.log("Table is synced"))
  .catch((err) => console.log("Sync error: ", err));

export {Sequelize};
export default connectDB;