const mysql = require("mysql2/promise");

const hosts = ["127.0.0.1", "localhost"];
const ports = [3306, 3307];
const users = ["root", "nextjs_user"];
const passwords = ["", "StrongRootPassword123", "StrongUserPassword123", "Ai_Digital@0701", "root", "admin", "123456"];

async function scan() {
  console.log("🔍 Scanning MySQL connection settings...");
  let found = false;

  for (const host of hosts) {
    for (const port of ports) {
      for (const user of users) {
        for (const password of passwords) {
          try {
            // Attempt connection without database name first to avoid "unknown database" errors
            const conn = await mysql.createConnection({
              host,
              port,
              user,
              password,
              connectTimeout: 2000
            });
            
            console.log(`\n🎉 SUCCESSFUL CONNECTION FOUND!`);
            console.log(`-----------------------------------`);
            console.log(`DB_HOST=${host}`);
            console.log(`DB_PORT=${port}`);
            console.log(`DB_USER=${user}`);
            console.log(`DB_PASSWORD=${password}`);
            console.log(`-----------------------------------`);
            
            // Try to create the database if it doesn't exist
            try {
              await conn.query("CREATE DATABASE IF NOT EXISTS ai_digital");
              console.log("✅ Database 'ai_digital' ensured/created successfully.");
            } catch (dbErr) {
              console.log("⚠️  Could not auto-create database 'ai_digital':", dbErr.message);
            }
            
            await conn.end();
            found = true;
            return; // stop scanning once we find one that works
          } catch (err) {
            // Silence connection failures, just keep scanning
          }
        }
      }
    }
  }

  if (!found) {
    console.log("\n❌ No successful connection found. Please ensure MySQL is started in XAMPP or Docker.");
  }
}

scan();
