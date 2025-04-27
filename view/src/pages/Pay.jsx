/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import MtnMoMoButton from "../components/MtnMomoBtn";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  CreditCard, 
  Wallet, 
  ChevronLeft, 
  CheckCircle2,
  Smartphone,
  Globe,
  Copy,
  ExternalLink
} from "lucide-react";

const PaymentPage = () => {
  const [clientId, setClientId] = useState(null);
  const [cost, setCost] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, dataToSend } = location.state || {};
  const [paypalError, setPaypalError] = useState(null);
  const [isPaypalLoading, setIsPaypalLoading] = useState(true);

  const bankDetails = {
    bankName: "Bank of Kigali",
    accountName: "HomeDel Rwanda Ltd",
    accountNumber: "00012345678",
    swiftCode: "BKIGRWRW",
    branch: "Kigali Main Branch"
  };

  useEffect(() => {
    if (!amount || !dataToSend) {
      navigate(-1);
    } else {
      setCost(amount);
    }
  }, [amount, dataToSend, navigate]);

  useEffect(() => {
    const fetchClientId = async () => {
      try {
        setIsPaypalLoading(true);
        const response = await axios.get("http://localhost:5000/config/paypal");
        if (!response.data?.clientId) {
          throw new Error("Invalid PayPal configuration received");
        }
        setClientId(response.data.clientId);
        setPaypalError(null);
      } catch (error) {
        console.error("Error fetching PayPal client ID:", error);
        setPaypalError("Failed to load PayPal configuration. Please try again later.");
        message.error({
          content: "Failed to load PayPal configuration",
          className: "custom-message error",
        });
      } finally {
        setIsPaypalLoading(false);
      }
    };

    fetchClientId();
  }, []);

  const createOrder = async (data, actions) => {
    try {
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          currency: "USD",
        }),
      });
      const orderData = await response.json();
      return orderData.orderId;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      message.error({
        content: "Error creating order",
        className: "custom-message error",
      });
      throw error;
    }
  };

  const onApprove = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/capture-order", {
        orderId: data.orderID,
      });

      if (response.data.success) {
        message.success({
          content: "Payment Successful!",
          className: "custom-message success",
        });
        // Navigate to success page or handle success
      } else {
        message.error({
          content: "Payment failed",
          className: "custom-message error",
        });
      }
    } catch (error) {
      console.error("Error capturing payment:", error);
      message.error({
        content: "Error capturing payment",
        className: "custom-message error",
      });
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    message.error({
      content: "An error occurred during payment",
      className: "custom-message error",
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success({
      content: "Copied to clipboard!",
      className: "custom-message success",
    });
  };

  const formattedAmount = new Intl.NumberFormat("en-US").format(amount);

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-full bg-green-50 dark:bg-green-900/20"
        >
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 sm:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Complete Your Payment
              </h2>
              <p className="mt-4 text-xl text-green-100">
                Amount to pay: <span className="font-bold">RWF {formattedAmount}</span>
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="px-6 py-8 sm:p-10">
            <div className="space-y-6">
              {/* Bank Transfer Section */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bank Transfer</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Pay directly to our bank account</p>
                  </div>
                  <button
                    onClick={() => setShowBankDetails(!showBankDetails)}
                    className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    {showBankDetails ? "Hide Details" : "View Details"}
                  </button>
                </div>

                <AnimatePresence>
                  {showBankDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 space-y-4">
                        {Object.entries(bankDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-white">{value}</span>
                              <button
                                onClick={() => copyToClipboard(value)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              >
                                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* MTN MoMo Section */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Smartphone className="h-8 w-8 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">MTN Mobile Money</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Pay easily with MTN MoMo</p>
                  </div>
                </div>
                <div className="mt-6">
                  <MtnMoMoButton amount={amount} data={dataToSend} />
                </div>
              </motion.div>

              {/* PayPal Section */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-shrink-0">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">PayPal</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Pay securely with PayPal</p>
                  </div>
                </div>
                {isPaypalLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : paypalError ? (
                  <div className="text-center py-6">
                    <p className="text-red-500 dark:text-red-400">{paypalError}</p>
                    <button
                      onClick={() => {
                        setPaypalError(null);
                        setIsPaypalLoading(true);
                        fetchClientId();
                      }}
                      className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Retry Loading PayPal
                    </button>
                  </div>
                ) : clientId ? (
                  <PayPalScriptProvider 
                    options={{ 
                      clientId: clientId,
                      currency: "USD",
                      intent: "capture",
                      components: "buttons"
                    }}
                  >
                    <PayPalButtons
                      style={{
                        layout: "horizontal",
                        color: "blue",
                        shape: "rect",
                        label: "pay"
                      }}
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={(err) => {
                        console.error("PayPal error:", err);
                        setPaypalError("An error occurred with PayPal. Please try again.");
                        onError(err);
                      }}
                      className="w-full"
                    />
                  </PayPalScriptProvider>
                ) : null}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-6 py-3 text-lg font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Checkout
          </button>
        </motion.div>
      </div>

      {/* Custom styles for antd messages */}
      <style jsx global>{`
        .custom-message {
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-top: 20vh;
        }
        .custom-message.success {
          background-color: #ecfdf5;
          border: 1px solid #34d399;
          color: #065f46;
        }
        .custom-message.error {
          background-color: #fef2f2;
          border: 1px solid #f87171;
          color: #991b1b;
        }
        .ant-message-notice-content {
          background: transparent;
          padding: 0;
          box-shadow: none;
        }
      `}</style>
    </motion.div>
  );
};

export default PaymentPage;
