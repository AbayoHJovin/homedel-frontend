import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { CurrentUserContext } from "../../constants/currentUser";
import { apiUrl } from "../lib/apis";
import OrderDetails from "../components/OrderDetails";
import Sidebar from "./Sidebar";
import PersonalDetails from "../components/PersonalDetails";
import {
  Calendar,
  ChevronDown,
  Package,
  Clock,
  Search,
  Loader,
  User2,
  Lock,
} from "lucide-react";

const Orders = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    if (currentUser?.userId) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/getOffer?userId=${currentUser.userId}`
      );
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((order) => {
        if (filter === "pending") return order.paymentStatus === "PENDING";
        if (filter === "paid") return order.paymentStatus === "PAID";
        if (filter === "delivering") return order.orderStatus === "DELIVERING";
        return true;
      });
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (order) => order.orderDate.split(" ")[0] === dateFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(search) ||
          order.mapAddress.toLowerCase().includes(search) ||
          order.orderItems.some((item) =>
            item.product.prodName.toLowerCase().includes(search)
          )
      );
    }

    return filtered;
  };

  const handleConfirmLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.message === "Logged out") {
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const labels = [
    {
      icon: <User2 />,
      text: "Account",
      value: "account",
      page: <PersonalDetails />,
    },
    {
      icon: <Package />,
      text: "Orders",
      value: "orders",
      page: null,
    },
    {
      icon: <Lock />,
      text: "Password",
      value: "password",
      page: null,
    },
  ];

  const filteredOrders = filterOrders();

  const mainContent = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage your orders
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white appearance-none"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="delivering">Delivering</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
                setDateFilter("");
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 text-green-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              Loading orders...
            </span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center"
          >
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || dateFilter || filter !== "all"
                ? "No orders match your filters. Try adjusting your search criteria."
                : "You haven't placed any orders yet."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredOrders.map((order) => (
              <OrderDetails key={order.orderId} order={order} />
            ))}
          </motion.div>
        )}

        {/* Order Stats */}
        {orders.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {orders.length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pending Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      orders.filter(
                        (order) => order.paymentStatus === "PENDING"
                      ).length
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Completed Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      orders.filter((order) => order.paymentStatus === "PAID")
                        .length
                    }
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    RWF{" "}
                    {new Intl.NumberFormat("en-US").format(
                      orders.reduce((total, order) => {
                        return (
                          total +
                          (order.transaction ? order.transaction.amount : 0)
                        );
                      }, 0)
                    )}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Sidebar
      labels={labels}
      handleConfirmLogout={handleConfirmLogout}
      isLoggingOut={false}
      activeTab={activeTab}
      onTabChange={(newTab) => {
        setActiveTab(newTab);
        window.location.href = `/account/${newTab}`;
      }}
    >
      {mainContent}
    </Sidebar>
  );
};

export default Orders;
