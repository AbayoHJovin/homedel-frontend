import { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "./Product";
import { Pagination, Stack } from "@mui/material";
import Loader3 from "./Loading3";

const ProductDisplay = memo(({ 
  products = [], 
  loading, 
  handleAddToCart, 
  handleDeleteItem, 
  localCart = [], 
  localFav = [],
  theme 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Adjust items per page based on screen size
  const getItemsPerPage = () => {
    if (window.innerWidth <= 640) return 4; // mobile
    if (window.innerWidth <= 768) return 6; // tablet
    if (window.innerWidth <= 1024) return 8; // small laptop
    return 12; // desktop
  };

  const productsPerPage = getItemsPerPage();
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = useCallback((_, pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader3 />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-8">
      {products.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {currentProducts.map((product) => {
              const isOnCart = localCart.includes(product.prodId);
              const isOnFav = localFav.includes(product.prodId);
              const mainImage = product.images?.find(img => img.isMain)?.imageUrl || 
                              product.images?.[0]?.imageUrl || 
                              product.image || 
                              "/placeholder.png";

              return (
                <motion.div
                  key={product.prodId}
                  layout
                  onClick={() => navigate(`/product/${product.prodId}`)}
                  className="w-full cursor-pointer min-w-[280px]"
                >
                  <ProductCard
                    itemImage={mainImage}
                    images={product.images || [{ imageUrl: mainImage }]}
                    itemName={product.prodName}
                    itemDesc={product.prodDescription}
                    itemPrice={`RWF ${product.price.toLocaleString()}`}
                    handleAddToCart={(event) => handleAddToCart(product.prodId, event)}
                    deleteItem={(event) => handleDeleteItem(product.prodId, event)}
                    isOnCart={isOnCart}
                    isOnFav={isOnFav}
                  />
                </motion.div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-12 mb-8">
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="circular"
                  size="large"
                  siblingCount={1}
                  boundaryCount={2}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme === "dark" ? "#fff" : "#000",
                      borderColor: theme === "dark" ? "#fff" : "#000",
                      fontSize: "1.1rem",
                      padding: "12px",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: theme === "dark" ? "#fff" : "#000",
                      color: theme === "dark" ? "#000" : "#fff",
                    },
                    "& .MuiPaginationItem-ellipsis": {
                      color: theme === "dark" ? "#fff" : "#000",
                    },
                  }}
                />
              </Stack>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-black font-bold text-lg flex flex-col items-center justify-center dark:text-white">
            <svg
              className="w-24 h-24 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1>No products available</h1>
          </div>
        </div>
      )}
    </div>
  );
});

ProductDisplay.displayName = "ProductDisplay";

export default ProductDisplay;