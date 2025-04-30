import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import useProducts from "../../constants/products";
import UserLocation from "./UserLocation";
import {
  Package,
  MapPin,
  Clock,
  CreditCard,
  ChevronDown,
  DownloadIcon,
  Truck,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const OrderDetails = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { products } = useProducts();

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "DELIVERING":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-5 h-5" />;
      case "PENDING":
        return <AlertCircle className="w-5 h-5" />;
      case "DELIVERING":
        return <Truck className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    try {
      // Handle the format "YYYY-MM-DD HH:mm AM/PM"
      const [datePart, timePart] = dateString.split(" ");
      const [hours, minutes] = timePart.split(":");

      // Create a new date object from the date part
      const date = new Date(datePart);

      // Set the hours and minutes
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));

      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString; // Return the original string if parsing fails
    }
  };

  const calculateTotal = () => {
    return order.orderItems.reduce((total, item) => {
      const product = products.find((p) => p.prodId === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  // Get product details for each order item
  const orderItemsWithDetails = order.orderItems.map((item) => {
    const product = products.find((p) => p.prodId === item.productId);
    return {
      ...item,
      productDetails: product || null,
    };
  });

  return (
    <motion.div
      layout
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden mb-4"
    >
      {/* Order Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-2 rounded-lg ${getStatusColor(
                order.paymentStatus
              )}`}
            >
              {getStatusIcon(order.paymentStatus)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{order.orderId.slice(-8)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(order.orderDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                RWF {new Intl.NumberFormat("en-US").format(calculateTotal())}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {order.orderItems.length} items
              </p>
            </div>
            <motion.button
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-6 space-y-6">
              {/* Delivery Location Map */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Delivery Location
                  </h4>
                </div>
                <UserLocation
                  readOnly={true}
                  initialLocation={{
                    lat: order.latitude,
                    lng: order.longitude,
                    address: order.mapAddress,
                  }}
                />
              </div>

              {/* Order Status Timeline */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Order Timeline
                  </h4>
                </div>
                <div className="relative">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="space-y-6">
                    {/* Order Placed */}
                    <div className="flex items-center space-x-4">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Order Placed
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                    </div>
                    {/* Payment Status */}
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-5 h-5 rounded-full ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        } flex items-center justify-center`}
                      >
                        <CreditCard className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Payment {order.paymentStatus.toLowerCase()}
                        </p>
                        {order.transaction && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            via {order.transaction.paymentMethod}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Delivery Status */}
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-5 h-5 rounded-full ${
                          order.orderStatus === "DELIVERING"
                            ? "bg-blue-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        } flex items-center justify-center`}
                      >
                        <Truck className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.orderStatus === "DELIVERING"
                            ? "Out for Delivery"
                            : "Pending Delivery"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.orderStatus === "DELIVERING"
                            ? "Your order is on its way"
                            : "Preparing your order"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Order Items
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orderItemsWithDetails.map((item) =>
                    item.productDetails ? (
                      <div
                        key={item.productId}
                        className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-white dark:bg-gray-600 rounded-lg overflow-hidden">
                          <img
                            src={
                              item.productDetails.mainImage ||
                              "/placeholder.png"
                            }
                            alt={item.productDetails.prodName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.productDetails.prodName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            RWF{" "}
                            {new Intl.NumberFormat("en-US").format(
                              item.productDetails.price * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={item.productId}
                        className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Product Not Found
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {item.productId}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Delivery Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Delivery Address
                    </h4>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 dark:text-white mb-2">
                      {order.mapAddress}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Street: {order.street}
                    </p>
                  </div>
                </div>

                {/* Payment Information */}
                {order.transaction && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        Payment Details
                      </h4>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Method
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {order.transaction.paymentMethod}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Amount
                        </p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          RWF{" "}
                          {new Intl.NumberFormat("en-US").format(
                            order.transaction.amount
                          )}
                        </p>
                      </div>
                      {order.transaction.transactionUrl && (
                        <button
                          onClick={() =>
                            window.open(
                              order.transaction.transactionUrl,
                              "_blank"
                            )
                          }
                          className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                        >
                          <DownloadIcon className="w-4 h-4" />
                          <span>Download Receipt</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
    mapAddress: PropTypes.string.isRequired,
    street: PropTypes.string,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
    transaction: PropTypes.shape({
      paymentMethod: PropTypes.string.isRequired,
      amount: PropTypes.number,
      transactionUrl: PropTypes.string,
    }),
  }).isRequired,
};

export default OrderDetails;
