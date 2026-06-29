async function testApi() {
  const ports = [3000, 3001, 3002];
  for (const port of ports) {
    try {
      console.log(`Trying port ${port}...`);
      const res = await fetch(`http://127.0.0.1:${port}/api/blogs`);
      if (res.ok) {
        const data = await res.json();
        console.log(`Port ${port} success! Returned ${data.length} blogs:`);
        data.forEach(b => console.log(` - Title: "${b.title}", Slug: "${b.slug}"`));
        return;
      } else {
        console.log(`Port ${port} returned status: ${res.status}`);
      }
    } catch (err) {
      console.log(`Port ${port} failed: ${err.message}`);
    }
  }
}

testApi();
