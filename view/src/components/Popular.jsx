import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../../constants/products";
import PopularProductCard from "./PopularProductCard";
import { motion } from "framer-motion";

const Popular = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    if (products && !loading) {
      // Check if we have cached products and they're not expired
      const cached = localStorage.getItem("popularProducts");
      const cacheTimestamp = localStorage.getItem("popularProductsTimestamp");
      const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

      if (
        cached &&
        cacheTimestamp &&
        Date.now() - Number(cacheTimestamp) < CACHE_DURATION
      ) {
        setDisplayedProducts(JSON.parse(cached));
        return;
      }

      // Filter popular products
      const popularProducts = products.filter((product) => product.popular);

      // If we have more than 4 popular products, randomly select 4
      if (popularProducts.length > 4) {
        const randomProducts = [];
        const tempProducts = [...popularProducts];

        for (let i = 0; i < 4; i++) {
          const randomIndex = Math.floor(Math.random() * tempProducts.length);
          randomProducts.push(tempProducts[randomIndex]);
          tempProducts.splice(randomIndex, 1);
        }

        // Cache the selected products
        localStorage.setItem("popularProducts", JSON.stringify(randomProducts));
        localStorage.setItem("popularProductsTimestamp", Date.now().toString());
        setDisplayedProducts(randomProducts);
      } else {
        // If 4 or fewer products, show all of them
        localStorage.setItem(
          "popularProducts",
          JSON.stringify(popularProducts)
        );
        localStorage.setItem("popularProductsTimestamp", Date.now().toString());
        setDisplayedProducts(popularProducts);
      }
    }
  }, [products, loading]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Popular Products
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/shop/Unisex/pants")}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
          >
            View All
            <span className="text-xl">→</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayedProducts.map((product) => (
            <motion.div
              key={product.prodId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ y: -5 }}
            >
              <PopularProductCard
                product={product}
                onClick={() => navigate(`/product/${product.prodId}`)}
              />
            </motion.div>
          ))}
        </div>

        {displayedProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400">
              No new arrivals at the moment. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default Popular;
