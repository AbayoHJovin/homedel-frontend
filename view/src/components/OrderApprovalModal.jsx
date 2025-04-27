import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderApprovalModal = ({ isOpen, onClose, onApprove, orderId }) => {
  const [message, setMessage] = useState('');
  const [includeMessage, setIncludeMessage] = useState(false);

  const handleSubmit = () => {
    onApprove(orderId, includeMessage ? message : '');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Approve Order
            </h3>

            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={includeMessage}
                  onChange={(e) => setIncludeMessage(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Include approval message
                </span>
              </label>

              {includeMessage && (
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter approval message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  rows="4"
                />
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Approve
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderApprovalModal;