import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const Locations = () => {
  return (
    <div className="text-black dark:text-white font-roboto flex flex-col md:flex-row justify-evenly mx-2 ssm:mx-24">

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Content Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-medium">Our Location</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white font-poppins">
            Visit Our Store
          </h2>
          
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 font-poppins">
            <p>
              Experience our products firsthand and get personalized assistance from our expert staff.
              Visit us for exclusive in-store discounts and special offers.
            </p>
            <p>
              Find us in the heart of Kigali city, conveniently located near Makuza Peace Plaza.
            </p>
          </div>

          <a
            href="https://www.google.com/maps/place/Makuza+Peace+Plaza/@-1.9465656,30.0569905,925m/data=!3m2!1e3!4b1!4m6!3m5!1s0x19dca4240db7b3f5:0x5256fd511623ef15!8m2!3d-1.9465656!4d30.0595654!16s%2Fg%2F11c1nfd6s8!5m1!1e2?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-300 font-medium"
          >
            <Navigation className="w-5 h-5" />
            View on Google Maps
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/location.png"
              alt="Our Store Location"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent" />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-64 h-64 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-4 -left-4 w-64 h-64 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl -z-10" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Locations;
