const { scrapeWithBrowser } = require("./browser");
const { makeProduct } = require("./utils");

// CaratLane redirects to .us — use the rings listing page
const LISTING_URL =
  "https://www.caratlane.com/jewelry/rings.html?product_list_order=position";

async function scrape() {
  const raw = await scrapeWithBrowser(
    LISTING_URL,
    () => {
      const products = [];

      // CaratLane uses Magento: .product-item with .product-item-info
      document
        .querySelectorAll(".product-item")
        .forEach((el) => {
          const nameEl = el.querySelector(
            ".product-item-link, .product-item-name, a[title]"
          );
          const name =
            nameEl?.textContent?.trim() ||
            nameEl?.title ||
            nameEl?.getAttribute("title");
          const priceEl = el.querySelector(
            ".price, .price-wrapper .price, [data-price-amount]"
          );
          const price =
            priceEl?.textContent?.trim() ||
            priceEl?.getAttribute("data-price-amount");
          const img =
            el.querySelector("img.product-image-photo")?.src ||
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

      // Fallback: widget product grid on homepage
      if (products.length === 0) {
        document
          .querySelectorAll(
            ".products-grid .product-item, .widget-product-grid .slick-slide"
          )
          .forEach((el) => {
            const nameEl = el.querySelector("a[title], .product-item-link");
            const name = nameEl?.title || nameEl?.textContent?.trim() || "";
            const price = (
              el.querySelector(".price")?.textContent || ""
            ).trim();
            const img = el.querySelector("img")?.src;
            const link = el.querySelector("a")?.href;

            if (
              name &&
              name.length > 2 &&
              !products.find((p) => p.name === name)
            ) {
              products.push({ name, price, image: img, url: link });
            }
          });
      }

      return products;
    },
    {
      waitSelector: ".product-item, .products-grid, .product-items",
      timeout: 30000,
    }
  );

  return raw.map((p) =>
    makeProduct({
      name: p.name,
      price: p.price,
      image: p.image,
      url: p.url,
      source: "CaratLane",
      category: "Diamond Jewelry",
    })
  );
}

module.exports = { scrape };
