import { motion } from "framer-motion";
import { TruckIcon, ShieldCheck, Clock, Sparkles, ArrowRight } from "lucide-react";

const Hero = () => {
  const features = [
    {
      icon: <TruckIcon className="w-6 h-6 text-green-600" />,
      title: "Fast Delivery",
      description: "2-4 business days"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
      title: "Secure Payment",
      description: "100% protected"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      title: "Easy Returns",
      description: "30 days guarantee"
    }
  ];

  const categories = [
    { name: "New Arrivals", count: "250+" },
    { name: "Summer Sale", count: "150+" },
    { name: "Trending", count: "100+" }
  ];

  return (
    <div className="relative min-h-[90vh] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        className="absolute -top-24 right-0 w-96 h-96 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl"
      />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Top Categories */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full"
                >
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">{category.name}</span>
                  <span className="text-sm text-green-700/70">({category.count})</span>
                </motion.div>
              ))}
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight font-poppins">
                Discover Your{" "}
                <span className="text-green-600 relative">
                  Perfect Style
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      d="M0 12 Q50 5 100 12"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-green-200 dark:text-green-800"
                    />
                  </svg>
                </span>
                {" "}in Our Collection
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                Explore our curated selection of premium fashion items. New arrivals every week and exclusive deals for our members.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <motion.a
                href="/shop/Unisex/pants"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-green-600 text-green-600 hover:text-white hover:bg-green-600 dark:text-white text-lg font-medium rounded-full transition-all duration-300"
              >
                Join Us
                <Sparkles className="w-5 h-5" />
              </motion.a>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex flex-col items-center lg:items-start gap-2 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                >
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] lg:aspect-square max-w-2xl mx-auto">
              <motion.img
                src="/heroImage.png"
                alt="Fashion Collection"
                className="object-cover w-full h-full rounded-3xl shadow-2xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Floating Elements */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-8 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform -rotate-6"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <p className="text-green-600 font-semibold">New Arrivals! 🌟</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transform rotate-6"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <p className="text-green-600 font-semibold">10% Off First Order</p>
                </div>
              </motion.div>

              {/* Decorative Circles */}
              <div className="absolute -top-8 -right-8 w-80 h-80 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-8 -left-8 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;