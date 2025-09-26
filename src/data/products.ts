export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  category: 'electronics' | 'fashion' | 'home' | 'sports';
  description: string;
}

export const products: Product[] = [
  // Electronics
  {
    id: 1,
    name: "Power Bank",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 156,
    image: "assets:/data/IMG-20241130-WA0025.jpg",
    badge: "Best Seller",
    badgeColor: "bg-primary",
    category: "electronics",
    description: "Ultra Fast Charging Power Bank"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    badge: "New",
    badgeColor: "bg-success",
    category: "electronics",
    description: "Advanced fitness tracking with heart rate monitor"
  },
  {
    id: 3,
    name: "Laptop Gaming Pro",
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    badge: "Sale",
    badgeColor: "bg-secondary",
    category: "electronics",
    description: "High performance gaming laptop with RTX graphics"
  },
  {
    id: 4,
    name: "Smartphone 5G Pro",
    price: 899.99,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
    category: "electronics",
    description: "Latest 5G smartphone with triple camera system"
  },
  {
    id: 5,
    name: "Wireless Mouse Pro",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    category: "electronics",
    description: "Ergonomic wireless mouse with precision tracking"
  },
  {
    id: 6,
    name: "Mechanical Keyboard",
    price: 159.99,
    rating: 4.8,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80",
    category: "electronics",
    description: "RGB backlit mechanical keyboard for gaming"
  },
  {
    id: 7,
    name: "4K Webcam",
    price: 129.99,
    rating: 4.4,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=400&q=80",
    category: "electronics",
    description: "Ultra HD webcam for professional streaming"
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    category: "electronics",
    description: "Portable speaker with 360° sound"
  },
  {
    id: 9,
    name: "Smart TV 55 inch",
    price: 799.99,
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80",
    category: "electronics",
    description: "4K Smart TV with HDR and streaming apps"
  },
  {
    id: 10,
    name: "Tablet Pro 12 inch",
    price: 649.99,
    originalPrice: 749.99,
    rating: 4.5,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    category: "electronics",
    description: "Professional tablet with stylus support"
  },
  
  // Fashion
  {
    id: 11,
    name: "Premium Leather Bag",
    price: 149.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    badge: "Sale",
    badgeColor: "bg-secondary",
    category: "fashion",
    description: "Genuine leather handbag with multiple compartments"
  },
  {
    id: 12,
    name: "Designer Sunglasses",
    price: 199.99,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    category: "fashion",
    description: "UV protection designer sunglasses"
  },
  {
    id: 13,
    name: "Casual T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 289,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    category: "fashion",
    description: "100% cotton comfortable casual t-shirt"
  },
  {
    id: 14,
    name: "Formal Dress Shirt",
    price: 79.99,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
    category: "fashion",
    description: "Professional dress shirt, wrinkle-free"
  },
  {
    id: 15,
    name: "Winter Jacket",
    price: 159.99,
    originalPrice: 199.99,
    rating: 4.7,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
    category: "fashion",
    description: "Warm winter jacket with waterproof material"
  },
  {
    id: 16,
    name: "Running Shoes",
    price: 119.99,
    rating: 4.8,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    category: "fashion",
    description: "Lightweight running shoes with cushioned sole"
  },
  {
    id: 17,
    name: "Elegant Watch",
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.6,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80",
    category: "fashion",
    description: "Elegant analog watch with leather strap"
  },
  {
    id: 18,
    name: "Summer Dress",
    price: 89.99,
    rating: 4.5,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80",
    category: "fashion",
    description: "Flowy summer dress, perfect for warm weather"
  },
  {
    id: 19,
    name: "Denim Jeans",
    price: 69.99,
    originalPrice: 89.99,
    rating: 4.4,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    category: "fashion",
    description: "Classic fit denim jeans, premium quality"
  },
  {
    id: 20,
    name: "Fashion Sneakers",
    price: 99.99,
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80",
    category: "fashion",
    description: "Trendy fashion sneakers for everyday wear"
  },

  // Home & Living
  {
    id: 21,
    name: "Modern Table Lamp",
    price: 89.99,
    rating: 4.6,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    category: "home",
    description: "Contemporary table lamp with adjustable brightness"
  },
  {
    id: 22,
    name: "Cozy Throw Blanket",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    category: "home",
    description: "Soft and warm throw blanket for living room"
  },
  {
    id: 23,
    name: "Coffee Maker Pro",
    price: 179.99,
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    category: "home",
    description: "Programmable coffee maker with timer function"
  },
  {
    id: 24,
    name: "Indoor Plant Pot",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    category: "home",
    description: "Ceramic plant pot with drainage system"
  },
  {
    id: 25,
    name: "Wall Art Canvas",
    price: 79.99,
    rating: 4.6,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80",
    category: "home",
    description: "Abstract wall art canvas for modern homes"
  },
  {
    id: 26,
    name: "Kitchen Knife Set",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1594736797933-d0a56ba32803?w=400&q=80",
    category: "home",
    description: "Professional kitchen knife set with block"
  },
  {
    id: 27,
    name: "Bathroom Towel Set",
    price: 59.99,
    rating: 4.5,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80",
    category: "home",
    description: "Luxury cotton towel set, quick-dry"
  },
  {
    id: 28,
    name: "Dining Chair Set",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.7,
    reviews: 87,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    category: "home",
    description: "Modern dining chairs, set of 4"
  },
  {
    id: 29,
    name: "Smart Thermostat",
    price: 199.99,
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    category: "home",
    description: "WiFi enabled smart thermostat with app control"
  },
  {
    id: 30,
    name: "Area Rug 8x10",
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.4,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    category: "home",
    description: "Large area rug with geometric pattern"
  },

  // Sports & Fitness
  {
    id: 31,
    name: "Yoga Mat Premium",
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80",
    category: "sports",
    description: "Non-slip yoga mat with carrying strap"
  },
  {
    id: 32,
    name: "Adjustable Dumbbells",
    price: 299.99,
    rating: 4.7,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    category: "sports",
    description: "Space-saving adjustable dumbbell set"
  },
  {
    id: 33,
    name: "Exercise Bike",
    price: 499.99,
    originalPrice: 599.99,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    category: "sports",
    description: "Indoor exercise bike with digital display"
  },
  {
    id: 34,
    name: "Tennis Racket Pro",
    price: 179.99,
    rating: 4.5,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80",
    category: "sports",
    description: "Professional tennis racket with grip tape"
  },
  {
    id: 35,
    name: "Swimming Goggles",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.4,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80",
    category: "sports",
    description: "Anti-fog swimming goggles with UV protection"
  },
  {
    id: 36,
    name: "Basketball Official",
    price: 39.99,
    rating: 4.6,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80",
    category: "sports",
    description: "Official size basketball for indoor/outdoor"
  },
  {
    id: 37,
    name: "Protein Shaker Bottle",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.5,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    category: "sports",
    description: "BPA-free protein shaker with mixing ball"
  },
  {
    id: 38,
    name: "Resistance Bands Set",
    price: 29.99,
    rating: 4.7,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    category: "sports",
    description: "Complete resistance bands set with anchors"
  },
  {
    id: 39,
    name: "Golf Club Set",
    price: 799.99,
    originalPrice: 999.99,
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&q=80",
    category: "sports",
    description: "Complete golf club set with bag"
  },
  {
    id: 40,
    name: "Soccer Ball FIFA",
    price: 49.99,
    rating: 4.6,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&q=80",
    category: "sports",
    description: "FIFA approved soccer ball for matches"
  },

  // Additional products to reach 50+
  {
    id: 41,
    name: "Wireless Earbuds Pro",
    price: 179.99,
    originalPrice: 219.99,
    rating: 4.7,
    reviews: 298,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
    category: "electronics",
    description: "Noise cancelling wireless earbuds with case"
  },
  {
    id: 42,
    name: "Designer Backpack",
    price: 129.99,
    rating: 4.5,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    category: "fashion",
    description: "Stylish laptop backpack with USB charging port"
  },
  {
    id: 43,
    name: "Air Purifier HEPA",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    category: "home",
    description: "HEPA air purifier for cleaner indoor air"
  },
  {
    id: 44,
    name: "Running Belt",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.4,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    category: "sports",
    description: "Adjustable running belt with phone pocket"
  },
  {
    id: 45,
    name: "Smart Home Camera",
    price: 89.99,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    category: "electronics",
    description: "WiFi security camera with night vision"
  },
  {
    id: 46,
    name: "Fashion Scarf",
    price: 39.99,
    originalPrice: 54.99,
    rating: 4.3,
    reviews: 198,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    category: "fashion",
    description: "Silk blend fashion scarf in multiple colors"
  },
  {
    id: 47,
    name: "Kitchen Scale Digital",
    price: 34.99,
    rating: 4.6,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1594736797933-d0a56ba32803?w=400&q=80",
    category: "home",
    description: "Precision digital kitchen scale for cooking"
  },
  {
    id: 48,
    name: "Foam Roller",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.7,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    category: "sports",
    description: "High density foam roller for muscle recovery"
  },
  {
    id: 49,
    name: "Wireless Charger",
    price: 49.99,
    rating: 4.4,
    reviews: 123,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
    category: "electronics",
    description: "Fast wireless charging pad for smartphones"
  },
  {
    id: 50,
    name: "Luxury Wallet",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.5,
    reviews: 134,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    category: "fashion",
    description: "Genuine leather wallet with RFID blocking"
  }
];

export const getProductsByCategory = (category: string) => {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const searchProducts = (query: string) => {
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
};
