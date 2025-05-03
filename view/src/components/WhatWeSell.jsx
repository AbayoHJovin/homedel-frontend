import { CircleCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguageContext } from "../context/LanguageProvider";

const CategorySection = () => {
  const { t } = useLanguageContext();
  const [visibleCategories, setVisibleCategories] = useState([]);

  // Define categories with translation keys instead of hardcoded names
  const categories = [
    { key: "pants", icon: <CircleCheck />, href: "/shop/Unisex/pants" },
    { key: "shirts", icon: <CircleCheck />, href: "/shop/Unisex/shirts" },
    { key: "tshirts", icon: <CircleCheck />, href: "/shop/Unisex/shirts" },
    { key: "shorts", icon: <CircleCheck />, href: "/shop/Unisex/pants" },
    { key: "dresses", icon: <CircleCheck />, href: "/shop/Female/pants" },
    { key: "skirts", icon: <CircleCheck />, href: "/shop/Female/pants" },
    { key: "hats", icon: <CircleCheck />, href: "/shop/Unisex/hats" },
    { key: "watches", icon: <CircleCheck />, href: "/shop/Unisex/watches" },
    { key: "shoes", icon: <CircleCheck />, href: "/shop/Unisex/shoes" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCategories(categories.slice(0, 6));
      else if (width < 1024) setVisibleCategories(categories.slice(0, 8));
      else setVisibleCategories(categories);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("categories.browseTitle")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("categories.browseDescription")}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {visibleCategories.map((category, index) => (
          <motion.a
            href={category.href}
            key={category.key}
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
                {t(`categories.items.${category.key}`)}
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
