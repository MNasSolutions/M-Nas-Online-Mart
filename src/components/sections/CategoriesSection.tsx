import electronicsIcon from "@/assets/category-electronics.png";
import fashionIcon from "@/assets/category-fashion.png";
import homeIcon from "@/assets/category-home.png";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: electronicsIcon,
    description: "Latest gadgets & tech",
    itemCount: "2,500+ items",
    bgColor: "bg-primary/10",
    textColor: "text-primary"
  },
  {
    id: 2,
    name: "Fashion",
    icon: fashionIcon,
    description: "Trendy clothing & accessories",
    itemCount: "5,000+ items",
    bgColor: "bg-secondary/10",
    textColor: "text-secondary"
  },
  {
    id: 3,
    name: "Home & Living",
    icon: homeIcon,
    description: "Beautiful home essentials",
    itemCount: "3,200+ items",
    bgColor: "bg-success/10",
    textColor: "text-success"
  },
  {
    id: 4,
    name: "Sports & Fitness",
    icon: electronicsIcon, // Reusing for demo
    description: "Athletic gear & equipment",
    itemCount: "1,800+ items",
    bgColor: "bg-warning/10",
    textColor: "text-warning"
  }
];

export function CategoriesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/products?category=${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
              className="group cursor-pointer animate-fade-in block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-center hover-lift shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <img 
                    src={category.icon} 
                    alt={category.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                  />
                </div>
                
                <h3 className="text-sm sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 hidden sm:block">
                  {category.description}
                </p>
                
                <div className={`text-xs sm:text-sm font-medium ${category.textColor}`}>
                  {category.itemCount}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}