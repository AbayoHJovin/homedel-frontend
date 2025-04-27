import { motion } from "framer-motion";

const PopularProductCard = ({ product, onClick }) => {
  // Get main image or first available image
  const displayImage = product.images?.find(img => img.isMain)?.imageUrl || 
                      product.images?.[0]?.imageUrl || 
                      "/placeholder.png";

  return (
    <motion.div
      onClick={onClick}
      className="group cursor-pointer bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden">
        <img
          src={displayImage}
          alt={product.prodName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-1">
          {product.prodName}
        </h3>
        <p className="text-green-600 dark:text-green-400 font-bold">
          RWF {product.price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};

export default PopularProductCard; 