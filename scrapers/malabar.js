const { scrapeWithBrowser } = require("./browser");
const { makeProduct } = require("./utils");

// Mine is Malabar's diamond jewelry brand
const LISTING_URL = "https://www.malabargoldanddiamonds.com/brand/mine.html";

async function scrape() {
  const raw = await scrapeWithBrowser(
    LISTING_URL,
    () => {
      const products = [];

      // Try JSON-LD
      document
        .querySelectorAll('script[type="application/ld+json"]')
        .forEach((el) => {
          try {
            const data = JSON.parse(el.textContent);
            if (data["@type"] === "ItemList" && data.itemListElement) {
              data.itemListElement.forEach((item) => {
                const prod = item.item || item;
                products.push({
                  name: prod.name,
                  url: prod.url || prod["@id"],
                  price: prod.offers?.price,
                  image: Array.isArray(prod.image)
                    ? prod.image[0]
                    : prod.image,
                });
              });
            }
          } catch {}
        });

      if (products.length > 0) return products;

      // Malabar uses Magento-like structure
      const selectors = [
        ".product-item",
        ".product-card",
        ".product",
        ".product-tile",
        "[data-product-id]",
        ".item.product",
        ".products-grid .item",
        ".category-products .item",
      ];

      for (const sel of selectors) {
        if (products.length > 0) break;
        document.querySelectorAll(sel).forEach((el) => {
          const name = (
            el.querySelector(
              ".product-item-link, .product-name, a[title], h3, h4, .name"
            )?.textContent || el.querySelector("a")?.title || ""
          ).trim();
          const price = (
            el.querySelector(
              ".price, .product-price, [data-price-amount], .final-price"
            )?.textContent || ""
          ).trim();
          const img =
            el.querySelector("img")?.getAttribute("data-src") ||
            el.querySelector("img")?.src;
          const link = el.querySelector("a")?.href;

          if (
            name &&
            name.length > 2 &&
            name.length < 200 &&
            !products.find((p) => p.name === name)
          ) {
            products.push({ name, price, image: img, url: link });
          }
        });
      }

      return products;
    },
    {
      waitSelector:
        ".product-item, .product-card, .product, .product-tile, .products-grid",
      timeout: 30000,
    }
  );

  return raw.map((p) =>
    makeProduct({
      name: p.name,
      price: p.price,
      image: p.image,
      url: p.url,
      source: "Malabar Gold",
      category: "Diamond Jewelry",
    })
  );
}

module.exports = { scrape };
