// Demo data so the gallery works immediately while scrapers are being tuned
// These represent the types of products available on each site

const demoProducts = [
  // Tanishq
  {
    name: "Floral Diamond Pendant",
    price: 28470,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
    url: "https://www.tanishq.co.in/collections/diamond-jewellery",
    source: "Tanishq",
    category: "Diamond Jewelry",
  },
  {
    name: "Solitaire Diamond Ring",
    price: 52300,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
    url: "https://www.tanishq.co.in/collections/diamond-jewellery",
    source: "Tanishq",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Cluster Earrings",
    price: 34500,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop",
    url: "https://www.tanishq.co.in/collections/diamond-jewellery",
    source: "Tanishq",
    category: "Diamond Jewelry",
  },
  {
    name: "Elegant Diamond Necklace",
    price: 145000,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
    url: "https://www.tanishq.co.in/collections/diamond-jewellery",
    source: "Tanishq",
    category: "Diamond Jewelry",
  },

  // CaratLane
  {
    name: "Delicate Diamond Bracelet",
    price: 41200,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
    url: "https://www.caratlane.com/jewellery/diamond-jewellery.html",
    source: "CaratLane",
    category: "Diamond Jewelry",
  },
  {
    name: "Sparkle Stud Earrings",
    price: 18900,
    image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&h=400&fit=crop",
    url: "https://www.caratlane.com/jewellery/diamond-jewellery.html",
    source: "CaratLane",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Tennis Bracelet",
    price: 89500,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop",
    url: "https://www.caratlane.com/jewellery/diamond-jewellery.html",
    source: "CaratLane",
    category: "Diamond Jewelry",
  },
  {
    name: "Pear Drop Diamond Pendant",
    price: 22750,
    image: "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?w=400&h=400&fit=crop",
    url: "https://www.caratlane.com/jewellery/diamond-jewellery.html",
    source: "CaratLane",
    category: "Diamond Jewelry",
  },

  // BlueStone
  {
    name: "Classic Diamond Solitaire Ring",
    price: 67800,
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400&h=400&fit=crop",
    url: "https://www.bluestone.com/jewellery/diamond-jewellery.html",
    source: "BlueStone",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Halo Earrings",
    price: 43200,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=400&fit=crop",
    url: "https://www.bluestone.com/jewellery/diamond-jewellery.html",
    source: "BlueStone",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Mangalsutra",
    price: 55600,
    image: "https://images.unsplash.com/photo-1515562141589-67f0d569b6e5?w=400&h=400&fit=crop",
    url: "https://www.bluestone.com/jewellery/diamond-jewellery.html",
    source: "BlueStone",
    category: "Diamond Jewelry",
  },
  {
    name: "Baguette Diamond Bangle",
    price: 112000,
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop",
    url: "https://www.bluestone.com/jewellery/diamond-jewellery.html",
    source: "BlueStone",
    category: "Diamond Jewelry",
  },

  // Kalyan Jewellers
  {
    name: "Diamond Choker Necklace",
    price: 235000,
    image: "https://images.unsplash.com/photo-1599459183200-59c3fd67a16c?w=400&h=400&fit=crop",
    url: "https://www.kalyanjewellers.net/diamond-jewellery.html",
    source: "Kalyan Jewellers",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Jhumka Earrings",
    price: 78400,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop",
    url: "https://www.kalyanjewellers.net/diamond-jewellery.html",
    source: "Kalyan Jewellers",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Nose Pin",
    price: 8900,
    image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=400&fit=crop",
    url: "https://www.kalyanjewellers.net/diamond-jewellery.html",
    source: "Kalyan Jewellers",
    category: "Diamond Jewelry",
  },

  // Malabar Gold
  {
    name: "Diamond Bridal Set",
    price: 345000,
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400&h=400&fit=crop",
    url: "https://www.malabargoldanddiamonds.com/diamonds/jewellery",
    source: "Malabar Gold",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Kada Bangle",
    price: 95000,
    image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400&h=400&fit=crop",
    url: "https://www.malabargoldanddiamonds.com/diamonds/jewellery",
    source: "Malabar Gold",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Cocktail Ring",
    price: 42300,
    image: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=400&h=400&fit=crop",
    url: "https://www.malabargoldanddiamonds.com/diamonds/jewellery",
    source: "Malabar Gold",
    category: "Diamond Jewelry",
  },

  // PNG Jewellers
  {
    name: "Diamond Nath (Nose Ring)",
    price: 15600,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop",
    url: "https://www.pngjewellers.com/diamond-jewellery",
    source: "PNG Jewellers",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Maang Tikka",
    price: 28900,
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=400&fit=crop",
    url: "https://www.pngjewellers.com/diamond-jewellery",
    source: "PNG Jewellers",
    category: "Diamond Jewelry",
  },
  {
    name: "Diamond Layered Necklace",
    price: 167000,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&fit=crop",
    url: "https://www.pngjewellers.com/diamond-jewellery",
    source: "PNG Jewellers",
    category: "Diamond Jewelry",
  },
];

module.exports = demoProducts;
