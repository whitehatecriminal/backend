import mysql from "mysql2/promise";
import { DB_NAME } from "../constants.js";


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

export default connectDB;