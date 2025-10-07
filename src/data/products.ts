// src/data/productData.ts

// Automatically import all images (jpg, jpeg, png) from assets/data folder
const localImages = import.meta.glob("@/assets/data/*.{jpg,jpeg,png}", { eager: true });

// Convert imported images into an array of URLs
const imageList = Object.values(localImages).map((img: any) => img.default);

// Define product interface
interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge: string;
  badgeColor: string;
  category: string;
  description: string;
}

// Define products using images from the folder
export const products: Product[] = [
  {
    id: 1,
    name: "Power Bank",
    price: 299.99,
    rating: 4.8,
    reviews: 156,
    image: imageList[0], // 1 (2).jpg
    badge: "Best Seller",
    badgeColor: "bg-primary",
    category: "electronics",
    description: "Ultra-fast charging power bank for all devices.",
  },
  {
    id: 2,
    name: "Smart Fan",
    price: 179.99,
    rating: 4.6,
    reviews: 92,
    image: imageList[1], // 2.jpg
    badge: "Trending",
    badgeColor: "bg-warning",
    category: "electronics",
    description: "Energy-efficient fan with smart speed control.",
  },
  {
    id: 3,
    name: "Robotic Car",
    price: 499.99,
    rating: 4.9,
    reviews: 201,
    image: imageList[2], // 4.jpg
    badge: "New Arrival",
    badgeColor: "bg-success",
    category: "robotics",
    description: "Smart robotic car powered by AI and sensors.",
  },
  {
    id: 4,
    name: "Solar Generator",
    price: 899.99,
    rating: 4.7,
    reviews: 73,
    image: imageList[3], // IMG-20241130-WA0025.jpg
    badge: "Eco Friendly",
    badgeColor: "bg-success",
    category: "electronics",
    description: "Portable solar generator for home and outdoor use.",
  },
  {
    id: 5,
    name: "3D Simulation Kit",
    price: 349.99,
    rating: 4.5,
    reviews: 61,
    image: imageList[4], // IMG-20241130-WA0036.jpg
    badge: "Hot",
    badgeColor: "bg-danger",
    category: "software",
    description: "Complete set for 3D simulation and modeling.",
  },
  {
    id: 6,
    name: "Animated Learning Tool",
    price: 249.99,
    rating: 4.3,
    reviews: 48,
    image: imageList[5], // IMG-20250802-WA0023.jpg
    badge: "Top Rated",
    badgeColor: "bg-info",
    category: "education",
    description: "Interactive animation tool for online classes.",
  },
  {
    id: 7,
    name: "Virtual Robotics Car",
    price: 459.99,
    rating: 4.8,
    reviews: 135,
    image: imageList[6], // IMG-20250802-WA0027.jpg
    badge: "Limited Edition",
    badgeColor: "bg-purple-500",
    category: "robotics",
    description: "Virtual robotics car simulation training kit.",
  },
  {
    id: 8,
    name: "Smart Classroom Device",
    price: 199.99,
    rating: 4.4,
    reviews: 80,
    image: imageList[7], // IMG-20250802-WA0036.jpg
    badge: "Featured",
    badgeColor: "bg-secondary",
    category: "education",
    description: "Smart classroom assistant for interactive learning.",
  },
];
