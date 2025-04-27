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
import OfferModal from "../src/components/OfferModal";
import { ChevronDown, Filter, Calendar } from 'lucide-react';

const Orders = ({ AdminOptions, currentUser }) => {
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState(offers);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [boughtProducts, setBoughtProducts] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [isApproving, setIsApproving] = useState(false);
  const [activeTab, setActiveTab] = useState("Date");
  const { products } = useProducts();
  const { users } = UseUsers();
  const { currentUser: userWithAllCredentials } =
    useContext(CurrentUserContext);
  const { allOffers, isLoading } = useContext(OffersContext);
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);

  useEffect(() => {
    setLoading(true);
  }, []);
  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
  }, [isLoading]);
  useEffect(() => {
    if (AdminOptions) {
      setOffers(allOffers);
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
    console.log("offers", offers);
  }, []);
  useEffect(() => {
    if (offers && currentDate) {
      const todayOrders = offers.filter((order) => {
        const orderDate = order.orderDate.split(" ")[0];
        return orderDate === currentDate;
      });
      setFilteredOrders(todayOrders);
    }
  }, [offers, currentDate]);

  const handleDate = (date) => {
    if (offers) {
      const targetedOrders = offers.filter((order) => {
        const orderDate = order.orderDate.split(" ")[0];
        return orderDate === date;
      });
      setFilteredOrders(targetedOrders);
    }
  };

  function handleOfferClick(item) {
    setOpenOfferModal(true);
    const prod = [];
    setQuantities(item.orderItems.map((item) => item.quantity));
    for (let i = 0; i < item.orderItems?.length; i++) {
      const filteredProducts = products.filter(
        (items) => items.prodId === item.orderItems[i].productId
      );
      if (filteredProducts?.length > 0) {
        prod.push(...filteredProducts);
      }
    }
    setSelectedOrder(item);
    setBoughtProducts(prod);
  }
  function handleDecline(order) {
    fetch(`${apiUrl}/removeOrder?offerId=${order.orderId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((message) => {
        location.reload();
        toast.success("Order Removed");
        setOpenOfferModal(false);
      })
      .catch((e) => console.error(e));
  }
  function handleApprove(order, e) {
    setIsApproving(true);
    fetch(`${apiUrl}/updateOrder?offerId=${order.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "Offer Approved") {
          e.target.innerText = "Approved";
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsApproving(false));
  }
  const handleTabSwitch = (tab) => {
    // setShowContent(false);
    setTimeout(() => {
      setActiveTab(tab);
      // setShowContent(true);
    }, 300); // Delay for transition effect
  };

  useEffect(() => {}, [boughtProducts]);

  const handleFilterChange = (criteria) => {
    setFilterCriteria(criteria);
    let filtered = [...offers];
    
    switch(criteria) {
      case 'pending':
        filtered = filtered.filter(order => !order.approved);
        break;
      case 'approved':
        filtered = filtered.filter(order => order.approved);
        break;
      case 'today':
        filtered = filtered.filter(order => 
          order.orderDate.split(' ')[0] === currentDate);
        break;
      default:
        break;
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      {offers?.length === 0 ? (
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
              
              {/* Filters and Date Selection */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative">
                  <select
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full sm:w-40 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 appearance-none"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="today">Today</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>

                <div className="relative">
                  <input
                    type="date"
                    onChange={(e) => handleDate(e.target.value)}
                    defaultValue={currentDate}
                    className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Orders Content */}
          {openOfferModal ? (
            <OfferModal
              selectedOrder={selectedOrder}
              AdminOptions={AdminOptions}
              users={users}
              userWithAllCredentials={userWithAllCredentials}
              setOpenOfferModal={setOpenOfferModal}
              quantities={quantities}
              boughtProducts={boughtProducts}
              isApproving={isApproving}
              handleApprove={handleApprove}
              handleDecline={handleDecline}
            />
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
                          ? 'bg-green-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20'
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
