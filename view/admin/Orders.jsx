/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import useProducts from "../constants/products";
import { AiFillCloseCircle } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import { toast } from "react-toastify";
import { apiUrl } from "../src/lib/apis";
import { OffersContext } from "../constants/Offers";
import { CurrentUserContext } from "../constants/currentUser";
import Loader3 from "../src/components/Loading3";
import Loader2 from "../src/components/loader2";
import UseUsers from "../constants/Users";
import OrderTable from "../src/components/OrderTable";
import { ChevronDown, Filter, Calendar, Search } from "lucide-react";
import AdminOrderDetails from "../src/components/AdminOrderDetails";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";

const Orders = ({ AdminOptions, currentUser }) => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(offers);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { products } = useProducts();
  const { users } = UseUsers();
  const { currentUser: userWithAllCredentials } =
    useContext(CurrentUserContext);
  const { allOffers, isLoading } = useContext(OffersContext);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [dateFilter, setDateFilter] = useState(currentDate);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Check when allOffers becomes available
  useEffect(() => {
    if (allOffers && allOffers.length > 0 && AdminOptions) {
      setLoading(false);
    }
  }, [allOffers, AdminOptions]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);

  useEffect(() => {
    setLoading(true);

    // Failsafe timeout to prevent loader from getting stuck
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (AdminOptions) {
      setOffers(allOffers);
      setLoading(false);
    } else {
      fetch(`${apiUrl}/getOffer?userId=${currentUser}`, {
        method: "GET",
      })
        .then((resp) => resp.json())
        .then((message) => {
          setOffers(message.orders);
        })
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [AdminOptions, allOffers, currentUser]);

  useEffect(() => {
    if (offers && currentDate) {
      const todayOrders = offers.filter((order) => {
        const orderDate = order.orderDate.split(" ")[0];
        return orderDate === currentDate;
      });
      setFilteredOrders(todayOrders);
      setLoading(false);
    }
  }, [offers, currentDate]);

  const handleDate = (date) => {
    setDateFilter(date);
    applyFilters(filterCriteria, paymentFilter, searchQuery, date);
  };

  function handleOfferClick(order) {
    setSelectedOrder(order);
  }

  function handleCloseDetails() {
    setSelectedOrder(null);
  }

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
    applyFilters(criteria, paymentFilter, searchQuery, dateFilter);
  };

  const handlePaymentFilterChange = (filter) => {
    setPaymentFilter(filter);
    applyFilters(filterCriteria, filter, searchQuery, dateFilter);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(filterCriteria, paymentFilter, query, dateFilter);
  };

  const handleResetFilters = () => {
    setFilterCriteria("all");
    setPaymentFilter("all");
    setSearchQuery("");
    setDateFilter("");
    applyFilters("all", "all", "", "");
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
    const newSortOrder =
      sortType === sortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    // Apply sorting to current filtered orders
    sortOrders(filteredOrders, sortType, newSortOrder);
  };

  const sortOrders = (orders, sortType, order) => {
    const sorted = [...orders];

    switch (sortType) {
      case "date":
        sorted.sort((a, b) => {
          const dateA = new Date(a.orderDate.replace(" ", "T"));
          const dateB = new Date(b.orderDate.replace(" ", "T"));
          return order === "asc" ? dateA - dateB : dateB - dateA;
        });
        break;
      case "amount":
        sorted.sort((a, b) => {
          const amountA = a.transaction?.amount || 0;
          const amountB = b.transaction?.amount || 0;
          return order === "asc" ? amountA - amountB : amountB - amountA;
        });
        break;
      case "status":
        sorted.sort((a, b) => {
          if (order === "asc") {
            return a.orderStatus.localeCompare(b.orderStatus);
          } else {
            return b.orderStatus.localeCompare(a.orderStatus);
          }
        });
        break;
      default:
        break;
    }

    setFilteredOrders(sorted);
  };

  // Comprehensive filter function
  const applyFilters = (statusFilter, paymentFilter, searchText, dateValue) => {
    if (!offers || offers.length === 0) return;

    let filtered = [...offers];

    // Apply order status filter
    if (statusFilter !== "all") {
      switch (statusFilter) {
        case "pending":
          filtered = filtered.filter(
            (order) => order.orderStatus === "PENDING"
          );
          break;
        case "delivering":
          filtered = filtered.filter(
            (order) => order.orderStatus === "DELIVERING"
          );
          break;
        case "delivered":
          filtered = filtered.filter(
            (order) => order.orderStatus === "DELIVERED"
          );
          break;
        case "cancelled":
          filtered = filtered.filter(
            (order) => order.orderStatus === "CANCELLED"
          );
          break;
        case "today":
          filtered = filtered.filter(
            (order) => order.orderDate.split(" ")[0] === currentDate
          );
          break;
        default:
          break;
      }
    }

    // Apply payment status filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentFilter
      );
    }

    // Apply date filter
    if (dateValue) {
      filtered = filtered.filter(
        (order) => order.orderDate.split(" ")[0] === dateValue
      );
    }

    // Apply search filter
    if (searchText) {
      const query = searchText.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(query) ||
          (order.mapAddress &&
            order.mapAddress.toLowerCase().includes(query)) ||
          users
            .find((u) => u.userId === order.ordererId)
            ?.username.toLowerCase()
            .includes(query)
      );
    }

    // Apply current sort
    sortOrders(filtered, sortBy, sortOrder);

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Function to handle order status updates from AdminOrderDetails
  const handleOrderUpdated = (updatedOrder) => {
    // If we have the updated order directly, update it in place
    if (updatedOrder) {
      // Update the order in the offers array
      setOffers((prevOffers) => {
        const newOffers = [...prevOffers];
        const orderIndex = newOffers.findIndex(
          (o) => o.orderId === updatedOrder.orderId
        );

        if (orderIndex !== -1) {
          // Update the order in place
          newOffers[orderIndex] = { ...newOffers[orderIndex], ...updatedOrder };
        }

        return newOffers;
      });

      // If this is the currently selected order, update it
      if (selectedOrder && selectedOrder.orderId === updatedOrder.orderId) {
        setSelectedOrder((prevOrder) => ({ ...prevOrder, ...updatedOrder }));
      }

      // Re-apply filters
      handleFilterChange(filterCriteria);
    } else {
      // If no updated order is provided, fetch all orders from the API
      fetch(`${apiUrl}/getOffer`, {
        method: "GET",
        credentials: "include",
      })
        .then((resp) => resp.json())
        .then((message) => {
          if (message.orders) {
            setOffers(message.orders);

            // Update the selected order with fresh data if it exists
            if (selectedOrder) {
              const freshOrder = message.orders.find(
                (order) => order.orderId === selectedOrder.orderId
              );
              if (freshOrder) {
                setSelectedOrder(freshOrder);
              }
            }

            // Re-apply filters
            handleFilterChange(filterCriteria);
          }
        })
        .catch((e) => {
          console.error("Error fetching updated orders:", e);
          // If API fails, at least keep the UI updated with our optimistic update
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 />
        </div>
      ) : offers?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              No Orders Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              There are currently no orders to display
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {AdminOptions && (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Orders Overview
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {offers?.length} total orders found
                  </p>
                </div>
              )}

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sort by:
                </span>
                <button
                  onClick={() => handleSortChange("date")}
                  className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                    sortBy === "date"
                      ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSortChange("amount")}
                  className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                    sortBy === "amount"
                      ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Amount{" "}
                  {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
                <button
                  onClick={() => handleSortChange("status")}
                  className={`px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                    sortBy === "status"
                      ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Status{" "}
                  {sortBy === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {offers.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Package className="w-6 h-6 text-green-500" />
                </div>
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
                      offers.filter((order) => order.orderStatus === "PENDING")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Delivering
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {
                      offers.filter(
                        (order) => order.orderStatus === "DELIVERING"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Truck className="w-6 h-6 text-blue-500" />
                </div>
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
                      offers.filter(
                        (order) => order.orderStatus === "DELIVERED"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
          {/* Enhanced Filters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Order Status Filter */}
              <div className="relative">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  Order Status
                </div>
                <select
                  value={filterCriteria}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="w-full outline-none px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="today">Today&apos;s Orders</option>
                </select>
                {/* <ChevronDown className="absolute right-3 top-[60%] -translate-y-1/2 text-gray-500 w-4 h-4" /> */}
              </div>

              {/* Payment Status Filter */}
              <div className="relative">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  Payment Status
                </div>
                <select
                  value={paymentFilter}
                  onChange={(e) => handlePaymentFilterChange(e.target.value)}
                  className="w-full px-4 py-2 outline-none bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 appearance-none"
                >
                  <option value="all">All Payments</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  Order Date
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => handleDate(e.target.value)}
                  className="w-full outline-none px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200"
                />
              </div>

              {/* Search */}
              <div className="relative">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  Search
                </div>
                <input
                  type="text"
                  placeholder="Order ID, address, customer..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full outline-none px-4 py-2 pl-10 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200"
                />
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Orders Stats */}

          {/* Orders Content */}
          {selectedOrder ? (
            <div className="relative">
              <button
                onClick={handleCloseDetails}
                className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full z-10"
              >
                <AiFillCloseCircle className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              </button>
              <AdminOrderDetails
                order={selectedOrder}
                users={users}
                onOrderUpdated={handleOrderUpdated}
              />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Orders Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ||
                dateFilter ||
                filterCriteria !== "all" ||
                paymentFilter !== "all"
                  ? "No orders match your current filters. Try adjusting or resetting your filters."
                  : "There are currently no orders in the system."}
              </p>
              {(searchQuery ||
                dateFilter ||
                filterCriteria !== "all" ||
                paymentFilter !== "all") && (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div>
              <OrderTable
                filteredOrders={currentItems}
                AdminOptions={AdminOptions}
                handleOfferClick={handleOfferClick}
                users={users}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === i + 1
                          ? "bg-green-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
