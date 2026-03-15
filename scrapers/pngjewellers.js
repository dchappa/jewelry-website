const { scrapeWithBrowser } = require("./browser");
const { makeProduct } = require("./utils");

const LISTING_URL = "https://www.pngjewellers.com/collections/diamond";

async function scrape() {
  const raw = await scrapeWithBrowser(
    LISTING_URL,
    () => {
      // Scroll to trigger lazy loading
      return new Promise((resolve) => {
        let totalHeight = 0;
        const timer = setInterval(() => {
          window.scrollBy(0, 500);
          totalHeight += 500;
          if (totalHeight >= document.body.scrollHeight || totalHeight > 8000) {
            clearInterval(timer);
            // Wait a moment for images to load
            setTimeout(() => {
              const products = [];
              const seen = new Set();

              // Find all product links with /products/ in the URL
              document.querySelectorAll("a").forEach((a) => {
                const href = a.href || "";
                if (!href.includes("/products/")) return;

                // Extract product slug as unique key
                const slug = href.split("/products/")[1]?.split("?")[0];
                if (!slug || seen.has(slug)) return;
                seen.add(slug);

                // Get name from the link text or a nearby heading
                const name =
                  a.textContent?.trim() ||
                  a.title ||
                  a.getAttribute("aria-label") ||
                  "";

                // Get image - look for img in this link or its parent card
                const card = a.closest(
                  ".card, .product-card, .grid__item, li, div"
                );
                const img =
                  card?.querySelector("img")?.src ||
                  a.querySelector("img")?.src ||
                  null;

                // Get price
                const priceEl = card?.querySelector(
                  ".price, .money, [class*='price']"
                );
                const price = priceEl?.textContent?.trim() || null;

                if (name && name.length > 2) {
                  products.push({
                    name,
                    price,
                    image: img,
                    url: href,
                  });
                }
              });

              resolve(products);
            }, 2000);
          }
        }, 200);
      });
    },
    { timeout: 45000 }
  );

  // Deduplicate by name
  const uniqueMap = new Map();
  for (const p of raw) {
    if (!uniqueMap.has(p.name)) {
      uniqueMap.set(p.name, p);
    }
  }

  return [...uniqueMap.values()].map((p) =>
    makeProduct({
      name: p.name,
      price: p.price,
      image: p.image ? p.image.replace(/^\/\//, "https://") : null,
      url: p.url,
      source: "PNG Jewellers",
      category: "Diamond Jewelry",
    })
  );
}

module.exports = { scrape };
