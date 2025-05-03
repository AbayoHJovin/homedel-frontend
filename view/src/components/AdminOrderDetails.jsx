import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import useProducts from "../../constants/products";
import AdminMapView from "./AdminMapView";
import {
  Package,
  MapPin,
  Clock,
  CreditCard,
  ChevronDown,
  Truck,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
} from "lucide-react";
import { apiUrl } from "../lib/apis";
import { toast } from "react-hot-toast";

const AdminOrderDetails = ({ order, users, onOrderUpdated }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { products } = useProducts();

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "DELIVERING":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "DELIVERED":
        return "text-purple-600 bg-purple-100 dark:bg-purple-900/30";
      case "CANCELLED":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
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
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5" />;
      case "CANCELLED":
        return <AlertCircle className="w-5 h-5" />;
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

  // Get user details
  const customer = users.find((user) => user.userId === order.ordererId) || {};

  // Get product details for each order item
  const orderItemsWithDetails = order.orderItems.map((item) => {
    const product = products.find((p) => p.prodId === item.productId);
    return {
      ...item,
      productDetails: product || null,
    };
  });

  const updateOrderStatus = async (status) => {
    setIsUpdating(true);

    // Store the original order status in case we need to revert
    const originalStatus = order.orderStatus;

    try {
      // Optimistically update the UI first
      order.orderStatus = status;

      // Call the onOrderUpdated callback if provided to update UI immediately
      if (onOrderUpdated && typeof onOrderUpdated === "function") {
        onOrderUpdated(order);
      }

      // Now make the API call
      const response = await fetch(`${apiUrl}/updateOrder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Use cookies for authentication
        body: JSON.stringify({
          orderId: order.orderId,
          status: status, // Match the backend API parameter name
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Revert the optimistic update if there was an error
        order.orderStatus = originalStatus;
        if (onOrderUpdated) onOrderUpdated(order);
        throw new Error(data.error || "Failed to update order status");
      }

      // Show success message
      toast.success("Order status updated successfully");
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status: " + error.message);

      // Revert the optimistic update if there was an error
      order.orderStatus = originalStatus;
      if (onOrderUpdated) onOrderUpdated(order);
    } finally {
      setIsUpdating(false);
    }
  };

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
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {customer.username || "Unknown"}
              </span>
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
              {/* Customer Information */}
              <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Name
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {customer.username || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                        Phone
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {order.phoneNo || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Order Management
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOrderStatus("PENDING")}
                    disabled={isUpdating || order.orderStatus === "PENDING"}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      order.orderStatus === "PENDING"
                        ? "bg-yellow-200 text-yellow-800 cursor-default"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Pending</span>
                    </div>
                  </button>

                  <button
                    onClick={() => updateOrderStatus("DELIVERING")}
                    disabled={isUpdating || order.orderStatus === "DELIVERING"}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      order.orderStatus === "DELIVERING"
                        ? "bg-blue-200 text-blue-800 cursor-default"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <Truck className="w-4 h-4" />
                      <span>Delivering</span>
                    </div>
                  </button>

                  <button
                    onClick={() => updateOrderStatus("DELIVERED")}
                    disabled={isUpdating || order.orderStatus === "DELIVERED"}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      order.orderStatus === "DELIVERED"
                        ? "bg-green-200 text-green-800 cursor-default"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Delivered</span>
                    </div>
                  </button>

                  <button
                    onClick={() => updateOrderStatus("CANCELLED")}
                    disabled={isUpdating || order.orderStatus === "CANCELLED"}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      order.orderStatus === "CANCELLED"
                        ? "bg-red-200 text-red-800 cursor-default"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Cancel</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Location Map */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Delivery Location
                  </h4>
                </div>
                <AdminMapView
                  customerLocation={{
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
                          Payment Status: {order.paymentStatus.toLowerCase()}
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
                            : order.orderStatus === "DELIVERED"
                            ? "bg-green-500"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-red-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        } flex items-center justify-center`}
                      >
                        <Truck className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.orderStatus === "DELIVERING"
                            ? "Out for Delivery"
                            : order.orderStatus === "DELIVERED"
                            ? "Delivered"
                            : order.orderStatus === "CANCELLED"
                            ? "Cancelled"
                            : "Pending Delivery"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {order.orderStatus === "DELIVERING"
                            ? "Your order is on its way"
                            : order.orderStatus === "DELIVERED"
                            ? "Order has been delivered"
                            : order.orderStatus === "CANCELLED"
                            ? "Order has been cancelled"
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
                        className="flex space-x-4 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg"
                      >
                        <div className="w-16 h-16 flex-shrink-0 bg-white dark:bg-gray-800 rounded-md overflow-hidden">
                          <img
                            src={
                              item.productDetails.mainImage ||
                              item.productDetails.images?.[0]?.imageUrl ||
                              "/placeholder.png"
                            }
                            alt={item.productDetails.prodName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
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
                        className="flex space-x-4 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-lg"
                      >
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Product Unavailable
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

AdminOrderDetails.propTypes = {
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    orderStatus: PropTypes.string.isRequired,
    paymentStatus: PropTypes.string.isRequired,
    mapAddress: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    phoneNo: PropTypes.string,
    ordererId: PropTypes.string,
    transaction: PropTypes.shape({
      amount: PropTypes.number,
      paymentMethod: PropTypes.string,
    }),
    orderItems: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  users: PropTypes.array.isRequired,
  onOrderUpdated: PropTypes.func,
};

export default AdminOrderDetails;
