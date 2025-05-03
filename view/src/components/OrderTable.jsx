/* eslint-disable react/prop-types */
export default function OrderTable({
  filteredOrders,
  AdminOptions,
  handleOfferClick,
  users,
}) {
  // Function to get appropriate status color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "DELIVERING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "DELIVERED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  // Format prices
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price || 0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order ID
              </th>
              {AdminOptions && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                </>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredOrders?.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No orders found for the selected criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders?.map((order) => (
                <tr
                  key={order.orderId}
                  onClick={() => handleOfferClick(order)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                    #{order.orderId.slice(-8)}
                  </td>
                  {AdminOptions && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {users.find((u) => u.userId === order.ordererId)?.username.charAt(0) || "?"}
                            </span>
                          </div>
                          <span className="ml-3 text-sm text-gray-900 dark:text-gray-200">
                            {users.find((u) => u.userId === order.ordererId)?.username || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {order.phoneNo || "N/A"}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {order.orderItems?.length} items
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                    RWF {formatPrice(order.price || order.transaction?.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <div>{order.orderDate.split(" ")[0]}</div>
                      <div className="text-xs">{order.orderDate.split(" ")[1]}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(order.orderStatus || order.paymentStatus || "PENDING")
                    }`}>
                      {order.orderStatus || order.paymentStatus || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
