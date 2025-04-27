/* eslint-disable react/prop-types */
export default function OrderTable({
  filteredOrders,
  AdminOptions,
  handleOfferClick,
  users,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                No
              </th>
              {AdminOptions && (
                <>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Shipping Address
                  </th>
                </>
              )}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
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
              filteredOrders?.map((item, index) => (
                <tr
                  key={item.orderId}
                  onClick={() => handleOfferClick(item)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {index + 1}
                  </td>
                  {AdminOptions && (
                    <>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {users.find((u) => u.userId === item.ordererId)?.username.charAt(0)}
                            </span>
                          </div>
                          <span className="ml-3 text-sm text-gray-900 dark:text-gray-200">
                            {users.find((u) => u.userId === item.ordererId)?.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {item.address}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                    {item.orderItems?.length} items
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {item.orderDate.split(" ")[0]}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {item.orderDate.split(" ")[1]}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.approved
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {item.approved ? 'Approved' : 'Pending'}
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
