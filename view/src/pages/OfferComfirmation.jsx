import { CheckCircle, Package, Home, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OfferComfirmation = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-3xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Success Icon */}
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8">
            <CheckCircle className="w-14 h-14 text-green-600" strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center"
          variants={itemVariants}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 font-poppins">
            Order Placed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-poppins">
            Thank you for your purchase! Your order is being processed, and we'll call you 
            when it's ready for delivery. You can track your order in Your Orders section.
          </p>

          {/* Order Info Cards */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <motion.div 
              className="bg-green-50 rounded-xl p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Package className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Order</h3>
              <p className="text-gray-600">Monitor your order status and get real-time updates</p>
            </motion.div>

            <motion.div 
              className="bg-green-50 rounded-xl p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Home className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Updates</h3>
              <p className="text-gray-600">We'll notify you when your order is out for delivery</p>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={() => navigate('/account/orders')}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-green-700 bg-green-100 rounded-xl hover:bg-green-200 transition-all duration-300 w-full sm:w-auto justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Orders
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/shop/Unisex/pants')}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all duration-300 w-full sm:w-auto justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="mt-8 text-center text-gray-500 text-sm"
          variants={itemVariants}
        >
          <p>Need help? Contact our support team at support@example.com</p>
        </motion.div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default OfferComfirmation;
