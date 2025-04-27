/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useProducts from "../../constants/products";
import Navbar from "../components/Navbar";
import { CartContext } from "../../constants/cartItems";
import Loader3 from "../components/Loading3";

const ProductPage = () => {
  const { loading, itemsOnCart, addItemOncart, deleteItem } =
    useContext(CartContext);
  const [realProduct, setRealProduct] = useState(null);
  const [isOnCart, setIsOnCart] = useState(false);
  const { products } = useProducts();
  const { prodId } = useParams();
  const [loadingPage, setLoadingPage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Track selected image
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(2); // Default zoom level is 2x
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!prodId || !products.length) return; // Guard clause

      setLoadingPage(true);
      try {
        const product = products.find((product) => product.prodId === prodId);
        if (product) {
          const isOnTheCart = itemsOnCart?.find(
            (item) => item.productId === prodId
          );
          setIsOnCart(!!isOnTheCart);
          setRealProduct(product);

          // Set the initial image only if it hasn't been set yet or product changed
          if (
            product.images.length > 0 &&
            (!selectedImage || product.prodId !== realProduct?.prodId)
          ) {
            const mainImage =
              product.images.find((img) => img.isMain)?.imageUrl ||
              product.images[0]?.imageUrl;

            if (mainImage) {
              setSelectedImage(mainImage);
            }
          }
        }
      } finally {
        setLoadingPage(false);
      }
    };

    loadProduct();
  }, [prodId, products, itemsOnCart]); // Remove realProduct from dependencies

  // Filter related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === realProduct?.category && p.prodId !== prodId)
    .slice(0, 4); // Limit to 4 related products

  const handleThumbnailClick = (img, imageUrl) => {
    if (selectedImage === imageUrl) return; // Don't update if it's the same image
    setIsZoomed(false);
    setSelectedImage(imageUrl);
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
    setShowZoomControls(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setShowZoomControls(false);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  const handleZoomChange = (event) => {
    const newZoom = parseFloat(event.target.value);
    setZoomLevel(newZoom);
  };

  const handleMobileScroll = (e) => {
    if (window.innerWidth >= 1024) return; // Only for mobile/tablet
    const container = e.currentTarget;
    const scrollPercentage =
      (container.scrollLeft / (container.scrollWidth - container.clientWidth)) *
      100;
    setScrollPosition(scrollPercentage);
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <Navbar />
      {prodId ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
          {loadingPage || !realProduct ? (
            <div className="flex justify-center items-center h-[500px]">
              <Loader3 />
            </div>
          ) : (
            <>
              {/* Product Image Viewer and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                {/* Mobile Scroll Container */}
                <div className="lg:hidden w-full mb-6">
                  <div
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    onScroll={handleMobileScroll}
                  >
                    {realProduct.images.map((img, index) => (
                      <div key={index} className="flex-none w-full snap-center">
                        <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                          <img
                            src={img.imageUrl}
                            alt={`${realProduct.prodName} - View ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Scroll Indicators */}
                  <div className="flex justify-center gap-2 mt-4">
                    {realProduct.images.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          Math.round(
                            scrollPosition / (100 / realProduct.images.length)
                          ) === index
                            ? "w-6 bg-green-600"
                            : "w-1.5 bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block lg:col-span-1">
                  <div className="flex flex-col gap-3 sticky top-24">
                    {realProduct.images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => handleThumbnailClick(img, img.imageUrl)}
                        className={`relative w-16 h-16 rounded-md cursor-pointer overflow-hidden border-2 ${
                          selectedImage === img.imageUrl
                            ? "border-green-600"
                            : "border-gray-300 hover:border-green-400"
                        } transition-all duration-200`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={`${realProduct.prodName} - Thumbnail ${
                            index + 1
                          }`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Image - Desktop */}
                <div className="hidden lg:block lg:col-span-6">
                  <div className="sticky top-24">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                      {selectedImage && (
                        <div
                          className="relative w-full h-full"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          onMouseMove={handleMouseMove}
                        >
                          <img
                            src={selectedImage}
                            alt={realProduct?.prodName || ""}
                            className="w-full h-full object-contain"
                          />
                          {isZoomed && (
                            <div
                              className="absolute top-0 left-0 w-full h-full cursor-zoom-in"
                              style={{
                                backgroundImage: `url(${selectedImage})`,
                                backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: `${zoomLevel * 100}%`,
                                zIndex: 10,
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Zoom Controls */}
                    {selectedImage && (
                      <div className="mt-3">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-gray-500">1x</span>
                            <input
                              type="range"
                              min="1"
                              max="4"
                              step="0.1"
                              value={zoomLevel}
                              onChange={handleZoomChange}
                              className="flex-grow h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, #10B981 0%, #10B981 ${
                                  (zoomLevel - 1) * 33.33
                                }%, #D1D5DB ${
                                  (zoomLevel - 1) * 33.33
                                }%, #D1D5DB 100%)`,
                              }}
                            />
                            <span className="text-xs text-gray-500">4x</span>
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 rounded px-1.5 py-0.5">
                              {zoomLevel.toFixed(1)}x
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-24">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-800 dark:text-white mb-3">
                      {realProduct.prodName}
                    </h1>

                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-bold text-gray-800 dark:text-white">
                        RWF {realProduct.price}
                      </span>
                      <div className="flex items-center">
                        <span className="text-green-500">★★★★★</span>
                        <span className="ml-1 text-sm text-gray-500">
                          (1000)
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                      {realProduct.prodDescription}
                    </p>

                    <div className="mb-6">
                      <p className="text-red-500 text-sm font-medium">
                        Only {realProduct.stock} Items Left!
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        isOnCart
                          ? deleteItem(realProduct.prodId)
                          : addItemOncart(realProduct.prodId)
                      }
                      className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      {loading ? (
                        <Loader3 bg={"white"} />
                      ) : isOnCart ? (
                        "Remove from Cart"
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Similar Products */}
              {relatedProducts.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                    Similar Products
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {relatedProducts.map((related) => (
                      <div
                        key={related.prodId}
                        onClick={() => navigate(`/product/${related.prodId}`)}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                          <img
                            src={related.images[0]?.imageUrl}
                            alt={related.prodName}
                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-800 dark:text-white line-clamp-2">
                            {related.prodName}
                          </p>
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            RWF {related.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[500px] text-gray-500 dark:text-gray-200">
          No product selected
        </div>
      )}
    </div>
  );
};

export default ProductPage;
