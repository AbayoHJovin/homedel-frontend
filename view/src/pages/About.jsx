import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useLanguageContext } from "../context/LanguageProvider";

const About = () => {
  const { t } = useLanguageContext();

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
              {t("about.hero.title")}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-poppins">
              {t("about.hero.subtitle")}
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
                  {t("about.main.aboutUs.title")}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-poppins">
                  {t("about.main.aboutUs.content")}
                </p>
              </div>

              {/* Mission Section */}
              <div>
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4 font-poppins">
                  {t("about.main.mission.title")}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-poppins">
                  {t("about.main.mission.content")}
                </p>
              </div>

              {/* Vision Section */}
              <div>
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4 font-poppins">
                  {t("about.main.vision.title")}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-poppins">
                  {t("about.main.vision.content")}
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
                  alt={t("about.imageAlt")}
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
                {t("about.features.quality.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-poppins">
                {t("about.features.quality.content")}
              </p>
            </div>

            {/* Customer Service */}
            <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 font-poppins">
                {t("about.features.support.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-poppins">
                {t("about.features.support.content")}
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3 font-poppins">
                {t("about.features.delivery.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 font-poppins">
                {t("about.features.delivery.content")}
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
