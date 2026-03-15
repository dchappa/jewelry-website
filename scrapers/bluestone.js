const { scrapeWithBrowser } = require("./browser");
const { makeProduct } = require("./utils");

const LISTING_URL = "https://www.bluestone.com/jewellery/diamond-rings.html";

async function scrape() {
  const raw = await scrapeWithBrowser(
    LISTING_URL,
    () => {
      const products = [];

      // BlueStone uses <li> items with class "pid-XXXXX" inside .product-grid
      document
        .querySelectorAll(".product-grid > li[class*='pid-']")
        .forEach((el) => {
          // Product name and ID from data-details attribute: "Name__ID__Category"
          const detailsEl = el.querySelector(
            ".product-details[data-details]"
          );
          const details = detailsEl?.getAttribute("data-details");
          let name = "";
          if (details) {
            name = details.split("__")[0];
          }

          // Price from innerText (e.g., "RS. 91,766")
          const text = el.innerText || "";
          const priceMatch = text.match(/RS\.\s*([\d,]+)/i);
          const price = priceMatch ? priceMatch[1].replace(/,/g, "") : null;

          // Image from data-bg on .pr-i (lazy-loaded background)
          const imgEl = el.querySelector(".pr-i[data-bg]");
          const image = imgEl?.getAttribute("data-bg") || null;

          // Link from .p-image data-plink or anchor
          const linkEl = el.querySelector("[data-plink]");
          const url =
            linkEl?.getAttribute("data-plink") ||
            el.querySelector("a")?.href ||
            null;

          if (name) {
            products.push({ name, price, image, url });
          }
        });

      return products;
    },
    {
      waitSelector: ".product-grid",
      timeout: 30000,
    }
  );

  return raw.map((p) =>
    makeProduct({
      name: p.name,
      price: p.price,
      image: p.image,
      url: p.url,
      source: "BlueStone",
      category: "Diamond Jewelry",
    })
  );
}

module.exports = { scrape };
