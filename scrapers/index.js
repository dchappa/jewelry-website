const tanishq = require("./tanishq");
const caratlane = require("./caratlane");
const bluestone = require("./bluestone");
const kalyan = require("./kalyan");
const malabar = require("./malabar");
const pngjewellers = require("./pngjewellers");
const demoProducts = require("./demo-data");
const { closeBrowser } = require("./browser");

const scrapers = {
  tanishq,
  caratlane,
  bluestone,
  kalyan,
  malabar,
  pngjewellers,
};

async function scrapeAll() {
  const results = await Promise.allSettled(
    Object.entries(scrapers).map(async ([name, scraper]) => {
      try {
        console.log(`Scraping ${name}...`);
        const products = await scraper.scrape();
        console.log(`  ${name}: ${products.length} products`);
        return products;
      } catch (err) {
        console.error(`  ${name} failed: ${err.message}`);
        return [];
      }
    })
  );

  const scraped = results.flatMap((r) =>
    r.status === "fulfilled" ? r.value : []
  );

  // Close the shared browser after all scrapers finish
  await closeBrowser().catch(() => {});

  // Fill in demo data for sources that returned nothing
  const scrapedSources = new Set(scraped.map((p) => p.source));
  const demoFill = demoProducts.filter((p) => !scrapedSources.has(p.source));

  const combined = [...scraped, ...demoFill];
  console.log(
    `Returning ${scraped.length} scraped + ${demoFill.length} demo = ${combined.length} total products`
  );
  return combined;
}

async function scrapeSite(source) {
  const scraper = scrapers[source.toLowerCase()];
  if (!scraper) {
    throw new Error(`Unknown source: ${source}`);
  }
  const products = await scraper.scrape();
  if (products.length > 0) return products;

  // Fallback to demo data for this source
  const sourceName = Object.values({
    tanishq: "Tanishq",
    caratlane: "CaratLane",
    bluestone: "BlueStone",
    kalyan: "Kalyan Jewellers",
    malabar: "Malabar Gold",
    pngjewellers: "PNG Jewellers",
  })[Object.keys(scrapers).indexOf(source.toLowerCase())];

  return demoProducts.filter((p) => p.source === sourceName);
}

module.exports = { scrapeAll, scrapeSite };
