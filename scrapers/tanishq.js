const { scrapeWithBrowser } = require("./browser");
const { makeProduct } = require("./utils");

const LISTING_URL = "https://www.tanishq.co.in/shop/diamond";

async function scrape() {
  const raw = await scrapeWithBrowser(
    LISTING_URL,
    () => {
      const products = [];

      // Extract from JSON-LD ItemList
      document
        .querySelectorAll('script[type="application/ld+json"]')
        .forEach((el) => {
          try {
            const data = JSON.parse(el.textContent);
            if (data["@type"] === "ItemList" && data.itemListElement) {
              data.itemListElement.forEach((item) => {
                if (item.name) {
                  products.push({ name: item.name, url: item.url || null });
                }
              });
            }
          } catch {}
        });

      // Also try extracting from product cards in the DOM
      document
        .querySelectorAll(
          ".product-card, .product-tile, .product, [data-pid]"
        )
        .forEach((el) => {
          const name =
            el.querySelector(
              ".product-name, .pdp-link a, .product-title, h3, h4"
            )?.textContent?.trim() || el.querySelector("a")?.title;
          const priceEl = el.querySelector(
            ".product-price, .price, .sales .value, .selling-price"
          );
          const price = priceEl?.textContent?.trim() || priceEl?.getAttribute("content");
          const img =
            el.querySelector("img")?.getAttribute("data-src") ||
            el.querySelector("img")?.src;
          const link =
            el.querySelector("a")?.href;

          if (name && !products.find((p) => p.name === name)) {
            products.push({ name, price, image: img, url: link });
          }
        });

      return products;
    },
    { waitSelector: ".product-card, .product-tile, .product, [data-pid]" }
  );

  return raw.map((p) =>
    makeProduct({
      name: p.name,
      price: p.price,
      image: p.image,
      url: p.url,
      source: "Tanishq",
      category: "Diamond Jewelry",
    })
  );
}

module.exports = { scrape };
