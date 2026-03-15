const fs = require("fs");
const path = require("path");
const { scrapeAll } = require("../scrapers");

const OUTPUT_PATH = path.join(__dirname, "..", "public", "products.json");

async function main() {
  console.log("Starting scrape...");
  const start = Date.now();

  const products = await scrapeAll();

  const data = {
    products,
    lastFetched: new Date().toISOString(),
    count: products.length,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const sources = {};
  products.forEach((p) => {
    sources[p.source] = (sources[p.source] || 0) + 1;
  });

  console.log(`Done in ${elapsed}s`);
  console.log(`Wrote ${products.length} products to ${OUTPUT_PATH}`);
  console.log("By source:", JSON.stringify(sources));
}

main().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
