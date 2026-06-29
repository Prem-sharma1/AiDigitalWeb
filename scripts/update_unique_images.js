const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Read database config from .env
function readEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const config = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
      config[key] = value.trim();
    }
  });
  return config;
}

// 80 completely unique, active Unsplash photo IDs (no duplicates)
const uniqueUnsplashIds = [
  "photo-1460925895917-afdab827c52f", // 1
  "photo-1551836022-d5d88e9218df", // 2
  "photo-1516321318423-f06f85e504b3", // 3
  "photo-1517245386807-bb43f82c33c4", // 4
  "photo-1506784983877-45594efa4cbe", // 5
  "photo-1531403009284-440f080d1e12", // 6
  "photo-1508921912186-1d1a45ebb3c1", // 7
  "photo-1557200134-90327ee9fafa", // 8
  "photo-1556740738-b6a63e27c4df", // 9
  "photo-1486312338219-ce68d2c6f44d", // 10
  "photo-1498050108023-c5249f4df085", // 11
  "photo-1556742049-0cfed4f6a45d", // 12
  "photo-1504868584819-f8e8b4b6d7e3", // 13
  "photo-1454165804606-c3d57bc86b40", // 14
  "photo-1519389950473-47ba0277781c", // 15
  "photo-1555066931-4365d14bab8c", // 16
  "photo-1522071820081-009f0129c71c", // 17
  "photo-1517694712202-14dd9538aa97", // 18
  "photo-1579621970563-ebec7560ff3e", // 19
  "photo-1542831371-29b0f74f9713", // 20
  "photo-1556155092-490a1ba16284", // 21
  "photo-1507238691740-187a5b1d37b8", // 22
  "photo-1581291518633-83b4ebd1d83e", // 23
  "photo-1552664730-d307ca884978", // 24
  "photo-1511512578047-dfb367046420", // 25
  "photo-1457369804613-52c61a468e7d", // 26
  "photo-1496096265110-f83ad7f96608", // 27
  "photo-1526374965328-7f61d4dc18c5", // 28
  "photo-1434030216411-0b793f4b4173", // 29
  "photo-1573164713714-d95e436ab8d6", // 30
  "photo-1556741533-6e6a62bd8b49", // 31
  "photo-1497366811353-6870744d04b2", // 32
  "photo-1481487196290-c152efe083f5", // 33
  "photo-1488590528505-98d2b5aba04b", // 34
  "photo-1559526324-4b87b5e36e44", // 35
  "photo-1522202176988-66273c2fd55f", // 36
  "photo-1531538606174-0f90ff5dce83", // 37
  "photo-1487058792275-0ad4aaf24ca7", // 38
  "photo-1515378791036-0648a3ef77b2", // 39
  "photo-1501504905252-473c47e087f8", // 40
  "photo-1531297484001-80022131f5a1", // 41
  "photo-1497215728101-856f4ea42174", // 42
  "photo-1560250097-0b93528c311a", // 43
  "photo-1563986768609-322da13575f3", // 44
  "photo-1556742502-ec7c0e9f34b1", // 45
  "photo-1554415707-6e8cfc93fe23", // 46
  "photo-1451187580459-43490279c0fa", // 47
  "photo-1518770660439-4636190af475", // 48
  "photo-1504384308090-c894fdcc538d", // 49
  "photo-1551288049-bebda4e38f71", // 50
  "photo-1524758631624-e2822e304c36", // 51
  "photo-1557804506-669a67965ba0", // 52
  "photo-1517048676732-d65bc937f952", // 53
  "photo-1531482615713-2afd69097998", // 54
  "photo-1556761175-4b46a572b786", // 55
  "photo-1504607798333-52a30db54a5d", // 56
  "photo-1542744173-05336fcc7ad4", // 57
  "photo-1558494949-ef010cbdcc31", // 58
  "photo-1507679799987-c73779587ccf", // 59
  "photo-1568602471122-7832951cc4c5", // 60
  "photo-1499750310107-5fef28a66643", // 61
  "photo-1573164713988-8665fc963095", // 62
  "photo-1513530534585-c7b1394c6d51", // 63
  "photo-1573496359142-b8d87734a5a2", // 64
  "photo-1573497019940-1c28c88b4f3e", // 65
  "photo-1581091226825-a6a2a5aee158", // 66
  "photo-1581092921461-eab62e97a780", // 67
  "photo-1486406146926-c627a92ad1ab", // 68
  "photo-1568992687947-868a62a9f521", // 69
  "photo-1543269865-cbf427effbad", // 70
  "photo-1515187029135-18ee286d815b", // 71
  "photo-1560179707-f14e90ef3623", // 72
  "photo-1581092160607-ee22621dd758", // 73
  "photo-1512485694743-9c9538b4e6e0", // 74
  "photo-1572021335469-31706a17aaef", // 75
  "photo-1562577309-4932fdd64cd1", // 76
  "photo-1558655146-d09347e92766", // 77
  "photo-1537511446984-935f663eb1f4", // 78
  "photo-1497366216548-37526070297c", // 79
  "photo-1554224155-8d04cb21cd6c"  // 80
];

async function main() {
  // Validate no duplicate IDs
  const checked = new Set();
  const dupes = [];
  uniqueUnsplashIds.forEach((id, idx) => {
    if (checked.has(id)) {
      dupes.push({ id, index: idx });
    }
    checked.add(id);
  });

  if (dupes.length > 0) {
    console.error("DUPLICATES DETECTED IN UNIQUE LIST:", dupes);
    process.exit(1);
  }

  console.log("Validation passed! 80 completely unique Unsplash photo IDs found.");

  const env = readEnv();
  const db = await mysql.createConnection({
    host: env.DB_HOST || '127.0.0.1',
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ai_digital'
  });

  console.log("Connected to MySQL database.");

  // Fetch all blogs sorted by id
  const [blogs] = await db.query("SELECT id, title FROM blogs ORDER BY id ASC");
  console.log(`Found ${blogs.length} blogs in the database.`);

  let updatedCount = 0;
  for (let i = 0; i < blogs.length; i++) {
    const blog = blogs[i];
    const photoId = uniqueUnsplashIds[i];
    if (!photoId) {
      console.warn(`No unique photo ID available for blog index ${i}`);
      continue;
    }
    const coverUrl = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=60`;

    await db.query("UPDATE blogs SET cover_image = ? WHERE id = ?", [coverUrl, blog.id]);
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} blogs with unique cover images!`);
  await db.end();
}

main().catch(err => {
  console.error("Execution error:", err);
});
