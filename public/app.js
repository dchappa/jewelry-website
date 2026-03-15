let allProducts = [];
let currentSource = "all";
let currentSort = "default";

// Format price in INR
function formatPrice(price) {
  if (!price) return null;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

// Friendly time display for ISO date strings
function timeAgo(isoString) {
  if (!isoString) return "";
  const timestamp = new Date(isoString).getTime();
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Render product card
function renderCard(product) {
  const card = document.createElement("a");
  card.className = "product-card";
  card.href = product.url || "#";
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  const priceDisplay = product.price
    ? `<div class="product-price">${formatPrice(product.price)}</div>`
    : `<div class="product-price no-price">Price on request</div>`;

  const imageHTML = product.image
    ? `<img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.outerHTML='<div class=\\'product-image-placeholder\\'>&#x1F48E;</div>'" />`
    : `<div class="product-image-placeholder">&#x1F48E;</div>`;

  card.innerHTML = `
    ${imageHTML}
    <div class="product-info">
      <div class="product-source">${product.source}</div>
      <div class="product-name">${product.name}</div>
      ${priceDisplay}
    </div>
  `;

  return card;
}

// Filter and sort products
function getFilteredProducts() {
  let products = [...allProducts];

  if (currentSource !== "all") {
    products = products.filter(
      (p) => p.source.toLowerCase() === currentSource.toLowerCase()
    );
  }

  switch (currentSort) {
    case "price-asc":
      products.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
      break;
    case "price-desc":
      products.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case "name-asc":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return products;
}

// Render gallery
function renderGallery() {
  const gallery = document.getElementById("gallery");
  const products = getFilteredProducts();

  gallery.innerHTML = "";

  if (products.length === 0) {
    gallery.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">No products found</p>
        <p style="margin-top: 0.5rem;">Try selecting a different source or refreshing.</p>
      </div>
    `;
    return;
  }

  products.forEach((product) => {
    gallery.appendChild(renderCard(product));
  });

  document.getElementById("product-count").textContent =
    `${products.length} product${products.length !== 1 ? "s" : ""}`;
}

// Build source filter buttons
function buildSourceFilters(products) {
  const container = document.querySelector(".source-filters");
  const sources = [...new Set(products.map((p) => p.source))].sort();

  // Keep the "All" button, remove the rest
  const allBtn = container.querySelector('[data-source="all"]');
  container.innerHTML = "";
  container.appendChild(allBtn);

  sources.forEach((source) => {
    const count = products.filter((p) => p.source === source).length;
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.source = source.toLowerCase();
    btn.textContent = `${source} (${count})`;
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSource = btn.dataset.source;
      renderGallery();
    });
    container.appendChild(btn);
  });

  // Re-attach all-button listener
  allBtn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    allBtn.classList.add("active");
    currentSource = "all";
    renderGallery();
  });
}

// Load products from static JSON
async function loadProducts() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const gallery = document.getElementById("gallery");
  const refreshBtn = document.getElementById("refresh-btn");

  loading.style.display = "block";
  error.style.display = "none";
  gallery.innerHTML = "";
  refreshBtn.classList.add("spinning");

  try {
    const res = await fetch("products.json");
    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    allProducts = data.products;

    buildSourceFilters(allProducts);
    renderGallery();

    if (data.lastFetched) {
      document.getElementById("last-updated").textContent =
        `Updated ${timeAgo(data.lastFetched)}`;
    }
  } catch (err) {
    console.error("Load error:", err);
    error.style.display = "block";
  } finally {
    loading.style.display = "none";
    refreshBtn.classList.remove("spinning");
  }
}

// Event listeners
document.getElementById("sort-select").addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderGallery();
});

document.getElementById("refresh-btn").addEventListener("click", () => {
  loadProducts();
});

// Initial load
loadProducts();
