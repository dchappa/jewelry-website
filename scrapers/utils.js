const axios = require("axios");
const cheerio = require("cheerio");

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
};

async function fetchPage(url) {
  const response = await axios.get(url, {
    headers: HEADERS,
    timeout: 15000,
  });
  return cheerio.load(response.data);
}

async function fetchJSON(url) {
  const response = await axios.get(url, {
    headers: { ...HEADERS, Accept: "application/json" },
    timeout: 15000,
  });
  return response.data;
}

function cleanPrice(priceStr) {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[^\d.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function makeProduct({ name, price, image, url, source, category }) {
  return {
    name: name?.trim() || "Untitled",
    price: typeof price === "number" ? price : cleanPrice(price),
    image: image || null,
    url: url || null,
    source: source || "Unknown",
    category: category || "Diamond Jewelry",
  };
}

module.exports = { fetchPage, fetchJSON, cleanPrice, makeProduct, HEADERS };
