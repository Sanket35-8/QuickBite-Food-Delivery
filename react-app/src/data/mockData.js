/**
 * QuickBite - Food Delivery System
 * Mock Data Structure (Ready for Java Spring Boot REST API integration)
 * 
 * Later, these arrays can be replaced with API endpoints:
 * - GET /api/restaurants
 * - GET /api/foods
 * - GET /api/restaurants/{id}/menu
 * - POST /api/orders
 */

export const RESTAURANTS = [
  {
    id: 1,
    name: "Royal Awadh Biryani",
    cuisine: "Awadhi Biryani, Mughlai, Kebabs, Rolls",
    category: "biryani",
    rating: 4.8,
    reviewsCount: 1240,
    deliveryTime: "25-30 mins",
    costForTwo: 400,
    isVeg: false,
    offer: "50% OFF UPTO ₹100",
    address: "Block B, Inner Circle, Connaught Place, New Delhi",
    distance: "2.4 km away",
    fssai: "10022011000452",
    bgColor: "#FEF3C7",
    accentColor: "#D97706"
  },
  {
    id: 2,
    name: "Punjab Spice Grill",
    cuisine: "Butter Chicken, Dal Makhani, Garlic Naan",
    category: "north-indian",
    rating: 4.6,
    reviewsCount: 980,
    deliveryTime: "30-35 mins",
    costForTwo: 500,
    isVeg: false,
    offer: "FREE DELIVERY",
    address: "Sector 18, Noida • 3.1 km away",
    distance: "3.1 km away",
    fssai: "10022011000889",
    bgColor: "#FFEDD5",
    accentColor: "#EA580C"
  },
  {
    id: 3,
    name: "Dakshin Dosa Symphony",
    cuisine: "Mysore Masala Dosa, Filter Coffee, Idli Vada",
    category: "south-indian",
    rating: 4.9,
    reviewsCount: 1450,
    deliveryTime: "20-25 mins",
    costForTwo: 250,
    isVeg: true,
    offer: "PURE VEG",
    address: "Indiranagar 100ft Road, Bengaluru",
    distance: "1.8 km away",
    fssai: "10022011000772",
    bgColor: "#DCFCE7",
    accentColor: "#15803D"
  },
  {
    id: 4,
    name: "Delhi Chaat & Mithai House",
    cuisine: "Chole Bhature, Gol Gappe, Dahi Bhalla, Kaju Katli",
    category: "street-food",
    rating: 4.7,
    reviewsCount: 2100,
    deliveryTime: "20-25 mins",
    costForTwo: 200,
    isVeg: true,
    offer: "PURE VEG",
    address: "Chandni Chowk, Old Delhi",
    distance: "2.0 km away",
    fssai: "10022011000334",
    bgColor: "#FEE2E2",
    accentColor: "#EA580C"
  },
  {
    id: 5,
    name: "Kolkata Rolls & Momos",
    cuisine: "Egg Chicken Kathi Roll, Steamed & Fried Momos",
    category: "chinese",
    rating: 4.5,
    reviewsCount: 870,
    deliveryTime: "25-30 mins",
    costForTwo: 220,
    isVeg: false,
    offer: "20% OFF",
    address: "Park Street, Kolkata",
    distance: "2.8 km away",
    fssai: "10022011000551",
    bgColor: "#E0E7FF",
    accentColor: "#F59E0B"
  },
  {
    id: 6,
    name: "Coastal Curry & Seafood",
    cuisine: "Goan Fish Curry, Prawn Masala, Neer Dosa",
    category: "coastal",
    rating: 4.8,
    reviewsCount: 620,
    deliveryTime: "35-40 mins",
    costForTwo: 600,
    isVeg: false,
    offer: "FLAT ₹75 OFF",
    address: "Bandra West, Mumbai",
    distance: "3.5 km away",
    fssai: "10022011000662",
    bgColor: "#CCFBF1",
    accentColor: "#0D9488"
  },
  {
    id: 7,
    name: "The Tandoori Hub",
    cuisine: "Chicken Tikka, Afghani Paneer, Seekh Kebabs",
    category: "north-indian",
    rating: 4.6,
    reviewsCount: 750,
    deliveryTime: "30 mins",
    costForTwo: 450,
    isVeg: false,
    offer: "40% OFF",
    address: "Koregaon Park, Pune",
    distance: "2.2 km away",
    fssai: "10022011000119",
    bgColor: "#FFE4E6",
    accentColor: "#E11D48"
  },
  {
    id: 8,
    name: "Madras Cafe & Tiffin",
    cuisine: "Ghee Podi Dosa, Medu Vada, Ven Pongal, Sambar",
    category: "south-indian",
    rating: 4.7,
    reviewsCount: 1120,
    deliveryTime: "18-22 mins",
    costForTwo: 220,
    isVeg: true,
    offer: "PURE VEG",
    address: "Mylapore, Chennai",
    distance: "1.5 km away",
    fssai: "10022011000994",
    bgColor: "#FEF9C3",
    accentColor: "#EAB308"
  },
  {
    id: 9,
    name: "Sweet Bengal Confectionery",
    cuisine: "Mishti Doi, Rasgulla, Sandesh, Kaju Katli",
    category: "mithai",
    rating: 4.9,
    reviewsCount: 1890,
    deliveryTime: "15-20 mins",
    costForTwo: 300,
    isVeg: true,
    offer: "BEST DESSERTS",
    address: "Salt Lake Sector 1, Kolkata",
    distance: "1.9 km away",
    fssai: "10022011000223",
    bgColor: "#F3E8FF",
    accentColor: "#9333EA"
  }
];

export const CATEGORIES = [
  { id: "biryani", name: "Dum Biryani", count: "24 Kitchens", emoji: "🍚", bgColor: "#FEF3C7" },
  { id: "north-indian", name: "North Indian", count: "38 Kitchens", emoji: "🥘", bgColor: "#FFEDD5" },
  { id: "south-indian", name: "South Indian", count: "19 Kitchens", emoji: "🥞", bgColor: "#DCFCE7" },
  { id: "street-food", name: "Street Food", count: "27 Kitchens", emoji: "🥙", bgColor: "#FEE2E2" },
  { id: "chinese", name: "Rolls & Momos", count: "16 Kitchens", emoji: "🥟", bgColor: "#E0E7FF" },
  { id: "mithai", name: "Mithai & Sweets", count: "14 Kitchens", emoji: "🍧", bgColor: "#F3E8FF" },
  { id: "coastal", name: "Coastal Seafood", count: "11 Kitchens", emoji: "🦐", bgColor: "#CCFBF1" },
  { id: "tandoor", name: "Tandoori Kebabs", count: "22 Kitchens", emoji: "🍢", bgColor: "#FFE4E6" }
];

export const FEATURED_DISHES = [
  {
    id: "dish-awadhi-biryani",
    name: "Awadhi Dum Gosht Biryani",
    restaurant: "Royal Awadh Biryani",
    price: 380,
    originalPrice: 450,
    rating: 4.9,
    reviews: 412,
    isVeg: false,
    tag: "MUST TRY",
    category: "biryani",
    description: "Tender marinated meat slow-cooked in handi with aged saffron Basmati rice and Awadhi spices. Served with mint raita.",
    subtitle: "Portion: Regular • Served with Mint Raita & Salan"
  },
  {
    id: "dish-shahi-paneer",
    name: "Shahi Paneer Butter Masala",
    restaurant: "Punjab Spice Grill",
    price: 260,
    originalPrice: 310,
    rating: 4.8,
    reviews: 320,
    isVeg: true,
    tag: "BESTSELLER",
    category: "north-indian",
    description: "Soft fresh malai paneer simmered in velvety makhani gravy enriched with butter, cashew paste, and kasuri methi.",
    subtitle: "Extra Butter • Mild Spicy"
  },
  {
    id: "dish-garlic-naan",
    name: "Butter Garlic Naan (2 Pcs)",
    restaurant: "Royal Awadh Biryani",
    price: 100,
    originalPrice: 120,
    rating: 4.9,
    reviews: 540,
    isVeg: true,
    tag: "POPULAR",
    category: "breads",
    description: "Traditional clay oven baked leavened bread brushed with salted butter, roasted minced garlic, and fresh coriander.",
    subtitle: "Clay Oven Roasted with Fresh Garlic"
  },
  {
    id: "dish-mysore-dosa",
    name: "Mysore Butter Masala Dosa",
    restaurant: "Dakshin Dosa Symphony",
    price: 160,
    originalPrice: 190,
    rating: 4.9,
    reviews: 680,
    isVeg: true,
    tag: "CHEF SPECIAL",
    category: "south-indian",
    description: "Crispy golden fermented crepe smeared with fiery red garlic chutney, filled with spiced potato masala and dollop of white butter.",
    subtitle: "Served with 3 Chutneys & Piping Hot Sambar"
  },
  {
    id: "dish-dal-makhani",
    name: "Dal Makhani (Overnight Simmered)",
    restaurant: "Punjab Spice Grill",
    price: 220,
    originalPrice: 260,
    rating: 4.8,
    reviews: 490,
    isVeg: true,
    tag: "POPULAR",
    category: "north-indian",
    description: "Black lentils slow simmered for 16 hours with fresh tomato puree, white butter, and secret aromatic spices.",
    subtitle: "Authentic Dhaba Style • Creamy Rich"
  },
  {
    id: "dish-kathi-roll",
    name: "Double Egg Chicken Kathi Roll",
    restaurant: "Kolkata Rolls & Momos",
    price: 170,
    originalPrice: 200,
    rating: 4.7,
    reviews: 310,
    isVeg: false,
    tag: "BESTSELLER",
    category: "street-food",
    description: "Flaky paratha layered with double eggs, stuffed with juicy grilled chicken tikka, sliced onions, and tangy mustard kasundi.",
    subtitle: "Kolkata Style Street Food"
  }
];

export const MENU_CATEGORIES = [
  { id: "bestsellers", name: "⭐ Chef Bestsellers" },
  { id: "biryanis", name: "🍚 Royal Biryanis" },
  { id: "curries", name: "🥘 Rich Curries" },
  { id: "breads", name: "🫓 Breads & Naans" },
  { id: "desserts", name: "🍧 Desserts & Drinks" }
];

export const MENU_ITEMS = [
  // Bestsellers
  {
    id: "dish-awadhi-biryani",
    name: "Awadhi Dum Gosht Biryani",
    restaurant: "Royal Awadh Biryani",
    price: 380,
    originalPrice: 450,
    rating: 4.9,
    reviews: 412,
    isVeg: false,
    tag: "★ MUST TRY",
    category: "bestsellers",
    description: "Tender marinated meat slow-cooked in handi with aged saffron Basmati rice, Awadhi spices, fried onions. Served with mint raita and salan.",
    subtitle: "Portion: Regular • Served with Mint Raita & Salan"
  },
  {
    id: "dish-shahi-paneer",
    name: "Shahi Paneer Butter Masala",
    restaurant: "Royal Awadh Biryani",
    price: 260,
    originalPrice: 310,
    rating: 4.8,
    reviews: 320,
    isVeg: true,
    tag: "★ BESTSELLER",
    category: "bestsellers",
    description: "Soft fresh malai paneer simmered in velvety makhani gravy enriched with butter, cashew paste, and kasuri methi.",
    subtitle: "Extra Butter • Mild Spicy"
  },
  {
    id: "dish-garlic-naan",
    name: "Butter Garlic Naan (2 Pcs)",
    restaurant: "Royal Awadh Biryani",
    price: 100,
    originalPrice: 120,
    rating: 4.9,
    reviews: 540,
    isVeg: true,
    tag: "",
    category: "bestsellers",
    description: "Traditional clay oven baked leavened bread, brushed with salted butter, roasted minced garlic, and fresh coriander.",
    subtitle: "Clay Oven Roasted with Fresh Garlic"
  },
  // Biryanis
  {
    id: "dish-lucknowi-biryani",
    name: "Lucknowi Murgh Dum Biryani",
    restaurant: "Royal Awadh Biryani",
    price: 320,
    originalPrice: 380,
    rating: 4.7,
    reviews: 290,
    isVeg: false,
    tag: "",
    category: "biryanis",
    description: "Classic chicken dum biryani infused with kewra water, saffron strands, whole spices, and caramelized onions.",
    subtitle: "Authentic Lucknowi Dum Cooking"
  },
  {
    id: "dish-paneer-tikka-biryani",
    name: "Shahi Paneer Tikka Biryani",
    restaurant: "Royal Awadh Biryani",
    price: 280,
    originalPrice: 330,
    rating: 4.6,
    reviews: 180,
    isVeg: true,
    tag: "",
    category: "biryanis",
    description: "Charcoal grilled smoky paneer cubes layered with aromatic basmati rice and saffron masala gravy.",
    subtitle: "Smoky Tandoori Paneer Flavour"
  },
  {
    id: "dish-subz-biryani",
    name: "Subz Dum Biryani (Vegetable)",
    restaurant: "Royal Awadh Biryani",
    price: 240,
    originalPrice: 290,
    rating: 4.5,
    reviews: 140,
    isVeg: true,
    tag: "",
    category: "biryanis",
    description: "Assorted seasonal garden vegetables, French beans, carrots, potatoes, and green peas simmered in basmati rice.",
    subtitle: "Fresh Farm Veggies"
  },
  // Curries
  {
    id: "dish-dal-makhani-menu",
    name: "Dal Makhani Slow-Cooked (Overnight)",
    restaurant: "Royal Awadh Biryani",
    price: 220,
    originalPrice: 260,
    rating: 4.8,
    reviews: 310,
    isVeg: true,
    tag: "★ POPULAR",
    category: "curries",
    description: "Black lentils slow simmered for 16 hours with tomato puree, white butter, and secret Awadhi spices.",
    subtitle: "16-Hour Slow Cooked"
  },
  {
    id: "dish-murgh-korma",
    name: "Awadhi Murgh Korma",
    restaurant: "Royal Awadh Biryani",
    price: 340,
    originalPrice: 390,
    rating: 4.7,
    reviews: 215,
    isVeg: false,
    tag: "",
    category: "curries",
    description: "Royal chicken curry prepared in yogurt, almond paste, brown onions, and aromatic whole spices.",
    subtitle: "Royal Almond & Saffron Gravy"
  },
  // Breads
  {
    id: "dish-tandoori-roti",
    name: "Tandoori Butter Roti",
    restaurant: "Royal Awadh Biryani",
    price: 35,
    originalPrice: 40,
    rating: 4.6,
    reviews: 420,
    isVeg: true,
    tag: "",
    category: "breads",
    description: "Crisp whole wheat flatbread baked in tandoor and brushed with fresh butter.",
    subtitle: "100% Whole Wheat"
  },
  {
    id: "dish-laccha-paratha",
    name: "Laccha Paratha",
    restaurant: "Royal Awadh Biryani",
    price: 65,
    originalPrice: 75,
    rating: 4.7,
    reviews: 260,
    isVeg: true,
    tag: "",
    category: "breads",
    description: "Multi-layered flaky whole wheat bread cooked on hot tawa with pure desi ghee.",
    subtitle: "Flaky & Crispy Desi Ghee Layers"
  },
  // Desserts
  {
    id: "dish-kesari-phirni",
    name: "Kesari Phirni in Matka",
    restaurant: "Royal Awadh Biryani",
    price: 120,
    originalPrice: 140,
    rating: 4.9,
    reviews: 380,
    isVeg: true,
    tag: "",
    category: "desserts",
    description: "Traditional slow-cooked ground rice pudding flavored with Kashmiri saffron, cardamom, and pistachio slivers.",
    subtitle: "Served Chilled in Clay Earthen Pot"
  },
  {
    id: "dish-badam-lassi",
    name: "Royal Badam Kesar Lassi",
    restaurant: "Royal Awadh Biryani",
    price: 90,
    originalPrice: 110,
    rating: 4.8,
    reviews: 510,
    isVeg: true,
    tag: "",
    category: "desserts",
    description: "Thick churned sweet yogurt drink topped with clotted cream, crushed almonds, and saffron essence.",
    subtitle: "Thick & Rich Traditional Drink"
  }
];

export const DEFAULT_CART_ITEMS = [
  {
    id: "dish-awadhi-biryani",
    name: "Awadhi Dum Gosht Biryani",
    restaurant: "Royal Awadh Biryani",
    price: 380,
    quantity: 1,
    isVeg: false,
    subtitle: "Portion: Regular • Served with Mint Raita & Salan"
  },
  {
    id: "dish-shahi-paneer",
    name: "Shahi Paneer Butter Masala",
    restaurant: "Punjab Spice Grill",
    price: 260,
    quantity: 1,
    isVeg: true,
    subtitle: "Extra Butter • Mild Spicy"
  },
  {
    id: "dish-garlic-naan",
    name: "Butter Garlic Naan (2 Pcs)",
    restaurant: "Royal Awadh Biryani",
    price: 100,
    quantity: 1,
    isVeg: true,
    subtitle: "Clay Oven Roasted with Fresh Garlic"
  }
];

export const COUPONS = {
  QUICK50: { code: "QUICK50", discountPercent: 50, maxDiscount: 100, minOrder: 249, desc: "Flat 50% OFF up to ₹100 on orders above ₹249" },
  ROYAL50: { code: "ROYAL50", discountPercent: 50, maxDiscount: 120, minOrder: 199, desc: "Flat 50% OFF up to ₹120 on orders above ₹199" },
  FLAT75: { code: "FLAT75", discountPercent: 100, maxDiscount: 75, minOrder: 150, desc: "Flat ₹75 OFF on orders above ₹150" }
};

export const DEFAULT_ADDRESSES = [
  {
    id: "home",
    type: "Home (Primary)",
    address: "Flat 402, Royal Residency, Barakhamba Road, Connaught Place, New Delhi - 110001",
    phone: "+91 98765 43210"
  },
  {
    id: "work",
    type: "Office / Work",
    address: "Tech Hub Tower, 6th Floor, Cyber City, Phase 2, Gurugram - 122002",
    phone: "+91 98765 43210"
  }
];
