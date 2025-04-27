import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import Navbar from "../components/Navbar";
import { CartContext } from "../../constants/cartItems";
import useProducts from "../../constants/products";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { toast, ToastContainer } from "react-toastify";
import { FaTimesCircle } from "react-icons/fa";
import Loader3 from "../components/Loading3";
import { message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "../utils/toastConfig.jsx";

const CartPage = () => {
  const { theme } = useContext(ThemeContext);
  const { itemsOnCart, deleteItem, UpdateResponse, updateCartItem } =
    useContext(CartContext);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [updated, setUpdated] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null });
  const [quantityError, setQuantityError] = useState(null);
  const [syncingItems, setSyncingItems] = useState({});

  useEffect(() => {
    if (itemsOnCart) {
      if (itemsOnCart.length > 0) {
        setQuantities(itemsOnCart.map((item) => item.quantity));
      }
      setLoading(false);
    }
  }, [itemsOnCart]);

  useEffect(() => {
    const newCartTotal = itemsOnCart.reduce(
      (total, item, index) => total + item.product.price * quantities[index],
      0
    );
    setCartTotal(newCartTotal);
  }, [quantities, itemsOnCart]);

  const handleQuantityChange = async (index, value, stock, itemId) => {
    if (value < 1) return;
    if (value > stock) {
      setQuantityError({
        index,
        message: `Only ${stock} items available in stock`,
      });
      return;
    }

    setQuantityError(null);
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);

    const success = await updateCartItem(itemId, value);
    if (!success) {
      newQuantities[index] = quantities[index];
      setQuantities(newQuantities);
    }
  };

  const handleDeleteConfirm = (itemId) => {
    setDeleteModal({ show: true, itemId });
  };

  const confirmDelete = () => {
    deleteItem(deleteModal.itemId);
    setDeleteModal({ show: false, itemId: null });
    message.success("Item removed from cart");
  };

  const handleCheck = () => {
    if (isNaN(cartTotal) || cartTotal < 1) {
      toast.error("Please enter a valid amount");
    } else {
      navigate(`/checkout`, { state: { cartTotal } });
    }
  };

  useEffect(() => {
    if (UpdateResponse) {
      if (UpdateResponse === "Insufficient stock for product.") {
        message.error("Insufficient stock for product.");
      } else {
        message.success("Cart updated");
      }
    }
  }, [UpdateResponse]);

  const goToShop = () => (
    <div className="flex h-screen flex-col justify-center items-center content-center">
      <h1 className="text-black dark:text-white">
        No item is found in your cart.
      </h1>
      <button
        onClick={() => navigate("/shop/Unisex/pants")}
        className="bg-green-900 text-white my-2 p-3 px-5 rounded-md"
      >
        Shop Now
      </button>
    </div>
  );

  const NotLoggedInView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 bg-green-100 dark:bg-green-900 rounded-full">
            <ShoppingBag className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Not Signed In
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in or create an account to access your shopping cart
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200 font-medium"
            >
              Sign In
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 transition-all duration-200 font-medium"
            >
              Create Account
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const DeleteModal = () => (
    <AnimatePresence>
      {deleteModal.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full"
          >
            <div className="text-center space-y-4">
              <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Remove Item
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to remove this item from your cart?
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setDeleteModal({ show: false, itemId: null })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        showSuccessToast("Item removed from cart");
        // ... rest of success handling
      } else {
        showErrorToast("Failed to remove item from cart");
      }
    } catch (error) {
      showErrorToast("Error removing item from cart");
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      showWarningToast("Quantity cannot be less than 1");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/cart/update/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        showSuccessToast("Cart updated successfully");
        // ... rest of success handling
      } else {
        showErrorToast("Failed to update cart");
      }
    } catch (error) {
      showErrorToast("Error updating cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={1}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      <Navbar />
      <DeleteModal />

      {!currentUser ? (
        <NotLoggedInView />
      ) : (
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex justify-center">
              <Loader3 />
            </div>
          ) : !itemsOnCart || itemsOnCart.length === 0 ? (
            goToShop()
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items Table */}
              <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Shopping Cart
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Product
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Price
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Quantity
                          </th>
                          <th className="text-left py-4 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total
                          </th>
                          <th className="py-4 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsOnCart.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-100 dark:border-gray-700/50"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-4">
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 group"
                                >
                                  {console.log("Image:", item.product)}
                                  <img
                                    src={
                                      item.product.mainImage ||
                                      item.product.images?.find(
                                        (img) => img.isMain
                                      )?.imageUrl ||
                                      item.product.images?.[0]?.imageUrl ||
                                      "/placeholder.png"
                                    }
                                    alt={item.product.prodName}
                                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                                    // onError={(e) => {
                                    //   e.target.src = '/placeholder.png';
                                    //   e.target.onerror = null;
                                    // }}
                                  />
                                </motion.div>
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                    {item.product.prodName}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Stock: {item.product.stock}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                RWF{" "}
                                {new Intl.NumberFormat("en-US").format(
                                  item.product.price
                                )}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      index,
                                      quantities[index] - 1,
                                      item.product.stock,
                                      item.id
                                    )
                                  }
                                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                  disabled={
                                    quantities[index] <= 1 ||
                                    syncingItems[item.id]
                                  }
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={quantities[index]}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        index,
                                        parseInt(e.target.value),
                                        item.product.stock,
                                        item.id
                                      )
                                    }
                                    className="w-16 px-2 py-1 text-center border rounded-md dark:bg-gray-700 dark:border-gray-600"
                                    disabled={syncingItems[item.id]}
                                  />
                                  {syncingItems[item.id] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-700 bg-opacity-80 dark:bg-opacity-80">
                                      <RefreshCw className="w-4 h-4 animate-spin text-green-600 dark:text-green-400" />
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      index,
                                      quantities[index] + 1,
                                      item.product.stock,
                                      item.id
                                    )
                                  }
                                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                  disabled={
                                    quantities[index] >= item.product.stock ||
                                    syncingItems[item.id]
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                              {quantityError?.index === index && (
                                <p className="text-xs text-red-500 mt-1">
                                  {quantityError.message}
                                </p>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                RWF{" "}
                                {new Intl.NumberFormat("en-US").format(
                                  item.product.price * quantities[index]
                                )}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() =>
                                  handleDeleteConfirm(item.product.prodId)
                                }
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                disabled={syncingItems[item.id]}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-fit">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Cart Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      RWF {new Intl.NumberFormat("en-US").format(cartTotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Free
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-900 dark:text-white font-medium">
                        Total
                      </span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        RWF {new Intl.NumberFormat("en-US").format(cartTotal)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheck}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
