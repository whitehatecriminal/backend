import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";


dotenv.config({
    path: './env'
})

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 3000, () =>{
        console.log(`Server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log(`Database connection failed !!! ${err}`);
})













// method 1

// (async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.MYSQL_HOST,
//       user: process.env.MYSQL_USER,
//       password: process.env.MYSQL_PASSWORD,
//       database: DB_NAME,
//     });
//     console.log(`\n MySQl connected !! DB HOST: ${connection.config.host}`);
    
//   } catch (error) {
//     console.error("ERROR: ", error);
//     process.exit(1);
//   }
// })();