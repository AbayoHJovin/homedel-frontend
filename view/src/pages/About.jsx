import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-50 to-white dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4">
              Discover Our Story!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-poppins">
              Your trusted destination for quality fashion and lifestyle products
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-[url('/bg-white.png')] opacity-10 pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* About Us Section */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 font-poppins">
                  About Us
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-poppins">
                  Welcome to Jov Store, your go-to destination for premium products
                  that blend quality, style, and value. Since 2011, we&apos;ve been
                  committed to providing our customers with a curated selection of
                  items across fashion, home decor, electronics, and more. Our mission
                  is to make shopping a delightful experience by offering
                  top-of-the-line products and exceptional customer service.
                </p>
              </div>

              {/* Mission Section */}
              <div>
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4 font-poppins">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-poppins">
                  To bring you the finest selection of products that enhance your
                  lifestyle, with a focus on quality, affordability, and customer
                  satisfaction. We strive to create an exceptional shopping experience
                  that exceeds your expectations.
                </p>
              </div>

              {/* Vision Section */}
              <div>
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4 font-poppins">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-poppins">
                  To be the leading online shopping destination known for quality,
                  variety, and a seamless shopping experience, making us your trusted
                  partner in everyday life. We aim to revolutionize the way you shop
                  by providing innovative solutions and unparalleled service.
                </p>
              </div>
            </motion.div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/hero.png"
                  alt="About Jov Store"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent" />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            {/* Quality */}
            <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 font-poppins">
                Premium Quality
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-poppins">
                We ensure all our products meet the highest standards of quality and durability.
              </p>
            </div>

            {/* Customer Service */}
            <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 font-poppins">
                24/7 Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-poppins">
                Our dedicated team is always ready to assist you with any queries or concerns.
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 font-poppins">
                Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-poppins">
                Quick and reliable shipping to ensure you receive your products on time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
