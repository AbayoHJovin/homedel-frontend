import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import CartItems from "../../constants/cartItems";
import FavItems from "../../constants/favItems";
import { Loader2 as Loader3 } from "lucide-react";
// import Loader3 from "../components/Loading3";

// Lazy load components
const MenPantsLazy = lazy(() => import("../components/Men/MenPants"));
const MenShoesLazy = lazy(() => import("../components/Men/MenShoes"));
const MenshirtsLazy = lazy(() => import("../components/Men/Menshirts"));
const WomenSkirtsLazy = lazy(() => import("../components/Women/WomenSkirts"));
const WomenShoesLazy = lazy(() => import("../components/Women/WomenShoes"));
const WomenShirtsLazy = lazy(() => import("../components/Women/WomenShirts"));
const WatchesLazy = lazy(() => import("../components/BothGender/Watches"));
const HatsLazy = lazy(() => import("../components/BothGender/Hats"));
const PantsLazy = lazy(() => import("../components/BothGender/Pants"));
const ShirtsLazy = lazy(() => import("../components/BothGender/Shirts"));
const ShoesLazy = lazy(() => import("../components/BothGender/Shoes"));

const ShopNow = () => {
  const navigate = useNavigate();
  const { gender, product } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(gender || "Male");
  const [selectType, setSelectType] = useState(product || "pants");
  const [showFav, setShowFav] = useState(false);

  useEffect(() => {
    if (showFav) {
      navigate("/shop/favourites");
    } else {
      navigate(`/shop/${selectedGender}/${selectType}`);
    }
  }, [selectedGender, selectType, navigate, showFav]);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setIsOpen(false);
    setShowFav(false);
  };

  const handleTypeSelect = (type) => {
    setSelectType(type);
    setTypeOpen(false);
    setShowFav(false);
  };

  return (
    <CartItems>
      <FavItems>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gradient-to-r from-green-600 to-green-400 dark:from-green-800 dark:to-green-600"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Find Your Perfect Style
                </h1>
                <p className="mt-2 text-lg text-green-100">
                  Browse our collection of premium products
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Gender Filter */}
                <div className="relative w-full sm:w-auto">
                  <div
                    className="relative inline-block z-[3] bg-white dark:bg-black w-full sm:w-auto text-left"
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    <button className="inline-flex justify-between w-full sm:w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      {selectedGender}
                      <FaChevronDown
                        className={`w-5 h-5 ml-2 transition-transform duration-300 transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <div
                      className={`origin-top-right absolute right-0 w-full sm:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-out transform ${
                        isOpen
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleGenderSelect("Male")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Male
                        </button>
                        <button
                          onClick={() => handleGenderSelect("Female")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Female
                        </button>
                        <button
                          onClick={() => handleGenderSelect("Unisex")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          For both genders
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="relative w-full sm:w-auto">
                  <div
                    className="relative inline-block z-[2] bg-white dark:bg-black w-full sm:w-auto text-left"
                    onMouseEnter={() => setTypeOpen(true)}
                    onMouseLeave={() => setTypeOpen(false)}
                  >
                    <button className="inline-flex justify-between w-full sm:w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      {selectType}
                      <FaChevronDown
                        className={`w-5 h-5 ml-2 transition-transform duration-300 transform ${
                          typeOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <div
                      className={`origin-top-right absolute right-0 z-20 w-full sm:w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition duration-300 ease-out transform ${
                        typeOpen
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleTypeSelect("shoes")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Shoes
                        </button>
                        <button
                          onClick={() => handleTypeSelect("pants")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Pants & Shorts
                        </button>
                        <button
                          onClick={() => handleTypeSelect("shirts")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Shirts & T-Shirts
                        </button>
                        <button
                          onClick={() => handleTypeSelect("watches")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Watches
                        </button>
                        <button
                          onClick={() => handleTypeSelect("hats")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Hats
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <Suspense fallback={<Loader3 />}>
                <motion.div
                  key={`${selectedGender}-${selectType}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {selectedGender === "Male" && selectType === "pants" ? (
                    <MenPantsLazy />
                  ) : selectedGender === "Male" && selectType === "shoes" ? (
                    <MenShoesLazy />
                  ) : selectedGender === "Male" && selectType === "shirts" ? (
                    <MenshirtsLazy />
                  ) : selectedGender === "Female" && selectType === "pants" ? (
                    <WomenSkirtsLazy />
                  ) : selectedGender === "Female" && selectType === "shoes" ? (
                    <WomenShoesLazy />
                  ) : selectedGender === "Female" && selectType === "shirts" ? (
                    <WomenShirtsLazy />
                  ) : (selectedGender === "Male" ||
                      selectedGender === "Female" ||
                      selectedGender === "Unisex") &&
                      selectType === "watches" ? (
                    <WatchesLazy />
                  ) : selectType === "hats" ? (
                    <HatsLazy />
                  ) : selectType === "pants" ? (
                    <PantsLazy />
                  ) : selectType === "shirts" ? (
                    <ShirtsLazy />
                  ) : selectType === "shoes" ? (
                    <ShoesLazy />
                  ) : null}
                </motion.div>
              </Suspense>
            </AnimatePresence>
          </div>
        </div>
      </FavItems>
    </CartItems>
  );
};

export default ShopNow;