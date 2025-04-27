import { AiFillCloseCircle } from "react-icons/ai";
import { CgTrash } from "react-icons/cg";
import Loader3 from "./Loading3";
import { Download } from "lucide-react";

/* eslint-disable react/prop-types */
export default function OfferModal({
  selectedOrder,
  AdminOptions,
  users,
  userWithAllCredentials,
  setOpenOfferModal,
  quantities,
  boughtProducts,
  isApproving,
  handleApprove,
  handleDecline,
}) {
  const handleDownloadReceipt = async () => {
    try {
      const response = await fetch(selectedOrder.transactionUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${selectedOrder.orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Order Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review and manage order information
              </p>
            </div>
            <button
              onClick={() => setOpenOfferModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
            >
              <AiFillCloseCircle className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
            </button>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-base text-gray-900 dark:text-white">
                  {AdminOptions
                    ? users.find((u) => u.userId === selectedOrder.ordererId)?.username
                    : userWithAllCredentials.username}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-base text-gray-900 dark:text-white">
                  {AdminOptions
                    ? users.find((u) => u.userId === selectedOrder.ordererId)?.email
                    : userWithAllCredentials.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedOrder.phoneNo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                <p className="text-base text-gray-900 dark:text-white">
                  {selectedOrder.address}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Ordered Items
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boughtProducts?.map((item, index) => (
                <div
                  key={item.prodId}
                  className="bg-white dark:bg-gray-700/50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-square relative">
                    <img
                      src={item.mainImage || item.images?.[0]?.imageUrl || '/placeholder.png'}
                      alt={item.prodName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2">
                      {item.prodName}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {quantities[index]}
                      </span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        RWF {new Intl.NumberFormat("en-US").format(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Receipt Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Payment Receipt
              </h3>
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-700/50 rounded-xl overflow-hidden">
              <img
                src={selectedOrder.transactionUrl}
                alt="Payment Receipt"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Payment Details
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Method</p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-base font-medium text-green-600 dark:text-green-400">
                    RWF {new Intl.NumberFormat("en-US").format(selectedOrder.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {AdminOptions && (
            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleDecline(selectedOrder)}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Decline Order
              </button>
              <button
                onClick={(e) => handleApprove(selectedOrder, e)}
                disabled={isApproving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isApproving ? <Loader3 bg="white" /> : "Approve Order"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
