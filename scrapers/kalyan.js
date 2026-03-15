const { scrapeWithBrowser } = require("./browser");
const { makeProduct } = require("./utils");

// Candere is Kalyan Jewellers' online store
const LISTING_URL = "https://www.candere.com/jewellery.html";

async function scrape() {
  const raw = await scrapeWithBrowser(
    LISTING_URL,
    () => {
      const products = [];

      // Candere uses Magento: .product-item with .product-item-info
      document
        .querySelectorAll(".item.product.product-item")
        .forEach((el) => {
          const nameEl = el.querySelector(
            ".product-item-link, .product-item-name, a.product-item-link"
          );
          const name = nameEl?.textContent?.trim() || nameEl?.title || "";
          const priceEl = el.querySelector(
            ".price, .price-wrapper .price, [data-price-amount], .final-price .price"
          );
          const price =
            priceEl?.textContent?.trim() ||
            priceEl?.getAttribute("data-price-amount");
          const img =
            el.querySelector(".product-image-photo")?.src ||
            el.querySelector("img")?.getAttribute("data-src") ||
            el.querySelector("img")?.src;
          const link =
            el.querySelector("a.product-item-link")?.href ||
            el.querySelector("a.product-item-photo")?.href ||
            el.querySelector("a")?.href;

          if (name && name.length > 2) {
            products.push({ name, price, image: img, url: link });
          }
        });

      return products;
    },
    {
      waitSelector: ".product-item, .product-items, .products-grid",
      timeout: 30000,
    }
  );

  return raw.map((p) =>
    makeProduct({
      name: p.name,
      price: p.price,
      image: p.image,
      url: p.url,
      source: "Kalyan Jewellers",
      category: "Diamond Jewelry",
    })
  );
}

module.exports = { scrape };
