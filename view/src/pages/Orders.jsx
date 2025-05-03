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
  SettingsIcon,
  Settings,
} from "lucide-react";
import { useLanguageContext } from "../context/LanguageProvider";

const Orders = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activeTab, setActiveTab] = useState("orders");
  const { t } = useLanguageContext();

  useEffect(() => {
    if (currentUser?.userId) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchOrders = async () => {
    // Helper function to calculate the total sum from an array of values (strings or numbers)
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
  const calculateTotalSpent = (orders) => {
    const total = orders.reduce((sum, order) => {
      const value = order.transaction ? order.transaction.amount : 0;
      // Remove commas if the value is a string with formatting (e.g., "100,000")
      const cleanValue =
        typeof value === "string"
          ? parseFloat(value.replace(/,/g, ""))
          : value;
      // Add to sum if the value is a valid number, otherwise add 0
      return sum + (isNaN(cleanValue) ? 0 : cleanValue);
    }, 0);

    // Format the total with commas for display
    return new Intl.NumberFormat("en-US").format(total);
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
      text: t("account.tabs.account"),
      value: "account",
      page: <PersonalDetails />,
    },
    {
      icon: <Package />,
      text: t("account.tabs.orders"),
      value: "orders",
      page: null,
    },
    {
      icon: <SettingsIcon />,
      text: t("account.tabs.settings"),
      value: "settings",
      page: <Settings />,
    },
  ];

  const filteredOrders = filterOrders();

  const mainContent = (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("orders.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("orders.subtitle")}
          </p>
        </div>
        {orders.length > 0 && (
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("orders.stats.totalOrders")}
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
                    {t("orders.stats.pendingOrders")}
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
                    {t("orders.stats.completedOrders")}
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
                    {t("orders.stats.totalSpent")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    RWF {calculateTotalSpent(orders)}
                  </p>
                </div>
                <Package className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        )}
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t("orders.filters.search")}
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
                <option value="all">{t("orders.filters.status.all")}</option>
                <option value="pending">
                  {t("orders.filters.status.pending")}
                </option>
                <option value="paid">{t("orders.filters.status.paid")}</option>
                <option value="delivering">
                  {t("orders.filters.status.delivering")}
                </option>
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
              {t("orders.filters.reset")}
            </button>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 text-green-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              {t("orders.loading")}
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
              {t("orders.noOrders.title")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || dateFilter || filter !== "all"
                ? t("orders.noOrders.noMatch")
                : t("orders.noOrders.empty")}
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
