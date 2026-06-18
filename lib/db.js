import mysql from "mysql2/promise";

let pool;

if (!global.mysqlPool) {
  global.mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "ai_digital",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

pool = global.mysqlPool;

export default pool;
export { pool };
