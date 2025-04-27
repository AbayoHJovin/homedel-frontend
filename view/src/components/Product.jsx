/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, memo } from "react";
import { FaCheckCircle } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

const ProductCard = memo(({
  itemImage,
  images,
  itemName,
  itemPrice,
  itemDesc,
  handleAddToCart,
  isOnCart,
  deleteItem,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const displayImage = images?.find(img => img.isMain)?.imageUrl || 
                      images?.[0]?.imageUrl ||
                      itemImage ||
                      "/placeholder.png";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 w-full"
    >
      <div className="relative w-full pt-[100%] overflow-hidden rounded-t-xl">
        <img
          src={displayImage}
          alt={itemName}
          className="absolute inset-0 w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
      </div>

      <div className="p-5 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">
          {loading ? <Skeleton width="80%" /> : itemName}
        </h3>
        
        <p className="text-base text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[3rem]">
          {loading ? <Skeleton width="100%" count={2} /> : itemDesc}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {loading ? <Skeleton width={80} height={32} /> : itemPrice}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              isOnCart ? deleteItem(e) : handleAddToCart(e);
            }}
            className={`px-6 py-2.5 rounded-full text-base font-medium transition-all duration-300 ${
              isOnCart 
                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-100"
                : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
            }`}
          >
            {isOnCart ? (
              <span className="flex items-center gap-2">
                <FaCheckCircle className="w-5 h-5" />
                Added
              </span>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
