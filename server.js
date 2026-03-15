const express = require("express");
const cors = require("cors");
const path = require("path");
const { scrapeAll, scrapeSite } = require("./scrapers");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// In-memory cache
let cache = { products: [], lastFetched: null };
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

app.get("/api/products", async (req, res) => {
  try {
    const { source, refresh } = req.query;

    const cacheExpired =
      !cache.lastFetched || Date.now() - cache.lastFetched > CACHE_TTL;

    if (refresh === "true" || cacheExpired || cache.products.length === 0) {
      console.log("Fetching fresh product data...");
      cache.products = await scrapeAll();
      cache.lastFetched = Date.now();
      console.log(`Fetched ${cache.products.length} products`);
    }

    let products = cache.products;
    if (source) {
      products = products.filter(
        (p) => p.source.toLowerCase() === source.toLowerCase()
      );
    }

    res.json({ products, lastFetched: cache.lastFetched });
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/products/:source", async (req, res) => {
  try {
    const products = await scrapeSite(req.params.source);
    res.json({ products });
  } catch (err) {
    console.error(`Error fetching from ${req.params.source}:`, err.message);
    res.status(500).json({ error: `Failed to fetch from ${req.params.source}` });
  }
});

app.get("/api/sources", (_req, res) => {
  res.json({
    sources: [
      { id: "tanishq", name: "Tanishq", url: "https://www.tanishq.co.in" },
      { id: "caratlane", name: "CaratLane", url: "https://www.caratlane.com" },
      { id: "bluestone", name: "BlueStone", url: "https://www.bluestone.com" },
      { id: "kalyan", name: "Kalyan Jewellers", url: "https://www.candere.com" },
      { id: "malabar", name: "Malabar Gold", url: "https://www.malabargoldanddiamonds.com" },
      { id: "pngjewellers", name: "PNG Jewellers", url: "https://www.pngjewellers.com" },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
