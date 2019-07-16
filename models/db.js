import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.NODE_ENV;

let db = null;

if (connectionString === "development") {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    multipleStatements: true
  });
} else if (connectionString === "production") {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    multipleStatements: true
  });
} else{
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_TEST_NAME,
    multipleStatements: true
  });
}

// console.log(db)

db.connect(err => {
  if (err) throw err;
  console.log("Connected...");
});

export default db;
