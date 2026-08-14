const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env" });

async function fixDb() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("Adding columns if they don't exist...");
    try { await pool.query("ALTER TABLE job_applications ADD COLUMN address TEXT"); } catch (e) { console.log(e.message); }
    try { await pool.query("ALTER TABLE job_applications ADD COLUMN city VARCHAR(100)"); } catch (e) { console.log(e.message); }
    try { await pool.query("ALTER TABLE job_applications ADD COLUMN district VARCHAR(100)"); } catch (e) { console.log(e.message); }

    const [columns] = await pool.query("SHOW COLUMNS FROM job_applications");
    console.log("job_applications columns:", columns);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

fixDb();
