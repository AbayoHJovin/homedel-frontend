import { CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const categories = [
  { name: "Pants", icon: <CircleCheck />, href: "/shop/Unisex/pants" },
  { name: "Shirts", icon: <CircleCheck />, href: "/shop/Unisex/shirts" },
  { name: "T-shirts", icon: <CircleCheck />, href: "/shop/Unisex/shirts" },
  { name: "Shorts", icon: <CircleCheck />, href: "/shop/Unisex/pants" },
  { name: "Dresses", icon: <CircleCheck />, href: "/shop/Female/pants" },
  { name: "Skirts", icon: <CircleCheck />, href: "/shop/Female/pants" },
  { name: "Hats", icon: <CircleCheck />, href: "/shop/Unisex/hats" },
  { name: "Watches", icon: <CircleCheck />, href: "/shop/Unisex/watches" },
  { name: "Shoes", icon: <CircleCheck />, href: "/shop/Unisex/shoes" },
];

const CategorySection = () => {
  const [visibleCategories, setVisibleCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCategories(categories.slice(0, 6));
      else if (width < 1024) setVisibleCategories(categories.slice(0, 8));
      else setVisibleCategories(categories);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Browse by Categories
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover our wide range of fashion categories
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {visibleCategories.map((category, index) => (
          <motion.a
            href={category.href}
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-4">
              <span className="text-4xl text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
            </div>
            <div className="absolute inset-0 bg-green-50 dark:bg-green-900/20 opacity-0 transition-opacity duration-300" />
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
