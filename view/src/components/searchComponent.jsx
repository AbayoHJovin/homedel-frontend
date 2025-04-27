/* eslint-disable react/prop-types */
import { memo, useState, useEffect, useCallback } from "react";
import { Modal, Input, Empty, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ShoppingCart, Info } from "lucide-react";

const SearchComponent = memo(({ 
  isModalVisible, 
  setIsModalVisible,
  searchResults = [],
  loading,
  handleAddToCart,
  handleDeleteItem,
  localCart = [],
  theme
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Categories derived from products
  const categories = ["all", ...new Set(searchResults.map(product => product.category))];

  // Memoized search function
  const handleSearch = useCallback((term) => {
    setIsSearching(true);
    let results = searchResults;
    
    // Filter by search term
    if (term) {
      results = results.filter(product => 
        product.prodName?.toLowerCase().includes(term.toLowerCase()) ||
        product.prodDescription?.toLowerCase().includes(term.toLowerCase()) ||
        product.category?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter(product => product.category === selectedCategory);
    }

    setFilteredResults(results);
    setIsSearching(false);
  }, [searchResults, selectedCategory]);

  // Handle input change with debounce
  const handleInputChange = useCallback((value) => {
    setSearchTerm(value);
    handleSearch(value);
  }, [handleSearch]);

  // Update filtered results when search results or category changes
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchResults, selectedCategory, handleSearch, searchTerm]);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSearchTerm("");
    setSelectedCategory("all");
    setFilteredResults([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <Modal
      title={null}
      open={isModalVisible}
      onCancel={handleModalClose}
      width="90vw"
      className="search-modal"
      footer={null}
      centered
    >
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="p-4"
      >
        {/* Search Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                className="py-3 pl-12 pr-10 text-lg rounded-xl border-2 border-gray-200 focus:border-green-500 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={() => handleInputChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all duration-300"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-600 hover:bg-green-50"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="relative min-h-[300px]">
          {loading || isSearching ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spin size="large" />
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResults.map((product) => {
                const isInCart = localCart.some(item => item.productId === product.prodId);
                const mainImage = product.images?.find(img => img.isMain)?.imageUrl || 
                                product.images?.[0]?.imageUrl || 
                                "/placeholder.png";

                return (
                  <motion.div
                    key={product.prodId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl overflow-hidden shadow-lg ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    {/* Product Image */}
                    <div 
                      className="relative aspect-square overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/product/${product.prodId}`)}
                    >
                      <img
                        src={mainImage}
                        alt={product.prodName}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                            -{product.discount}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {product.prodName}
                      </h3>
                      
                      <p className={`text-sm mb-3 line-clamp-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {product.prodDescription}
                      </p>

                      <div className="flex items-baseline mb-3">
                        <span className={`text-xl font-bold ${
                          theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                          RWF {product.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            isInCart ? handleDeleteItem(product.prodId) : handleAddToCart(product.prodId);
                          }}
                          className={`flex items-center px-3 py-2 rounded-lg ${
                            isInCart
                              ? 'bg-red-100 text-red-600 hover:bg-red-200'
                              : 'bg-green-100 text-green-600 hover:bg-green-200'
                          } transition-colors duration-300`}
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          {isInCart ? 'Remove' : 'Add to Cart'}
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/product/${product.prodId}`)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-300"
                        >
                          <Info className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Stock Status */}
                    {product.stock <= 5 && product.stock > 0 && (
                      <div className="px-4 py-2 bg-orange-100 text-orange-600 text-sm">
                        Only {product.stock} left in stock
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="px-4 py-2 bg-red-100 text-red-600 text-sm">
                        Out of stock
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-2">No products found</p>
                    <p className="text-sm text-gray-500">
                      Try adjusting your search or filters to find what you're looking for
                    </p>
                  </div>
                }
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
        .search-modal .ant-modal-content {
          border-radius: 1rem;
          overflow: hidden;
        }

        .search-modal .ant-modal-body {
          padding: 1.5rem;
        }

        .search-modal .ant-input {
          height: auto;
          font-size: 1rem;
        }

        .search-modal .ant-input:hover,
        .search-modal .ant-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }

        .search-modal .ant-spin-dot i {
          background-color: #10b981;
        }

        .search-modal .ant-empty {
          color: #6b7280;
        }

        @media (max-width: 640px) {
          .search-modal .ant-modal-content {
            margin: 0;
            border-radius: 0;
          }
        }
      `}</style>
    </Modal>
  );
});

SearchComponent.displayName = "SearchComponent";

export default SearchComponent;
