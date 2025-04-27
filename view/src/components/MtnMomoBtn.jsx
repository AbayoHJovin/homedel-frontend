/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Modal, Button, Input, Form, message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import UseAddOrder from "../../constants/addOrder";
import { FaMobileAlt, FaMoneyBillWave } from "react-icons/fa";

const MtnMoMoButton = ({ amount, data: orderData }) => {
  const { addOrder } = UseAddOrder();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const formattedAmount = new Intl.NumberFormat("en-US").format(amount);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [form] = Form.useForm();

  const handlePaymentRequest = async (values) => {
    try {
      setIsLoading(true);
      const { phoneNumber } = values;

      const response = await axios.post(
        "http://localhost:5000/request-to-pay",
        {
          amount,
          phoneNumber,
        }
      );

      if (response.data.success) {
        message.success({
          content: "Payment request sent successfully!",
          className: "custom-message success",
          style: { marginTop: '20vh' },
        });
        setIsModalVisible(false);
        const re = await addOrder(
          response.data.data,
          response.data.paymentType,
          orderData
        );
        console.log("Response data", response.data);
        console.log("Response", re);
      } else {
        message.error({
          content: "Something went wrong. Please try again.",
          className: "custom-message error",
          style: { marginTop: '20vh' },
        });
        console.error(`Error: ${response.data.error || response.data.message}`);
      }
    } catch (error) {
      message.error({
        content: "Something went wrong. Please try again.",
        className: "custom-message error",
        style: { marginTop: '20vh' },
      });
      console.error(`Unexpected Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <motion.button
        type="button"
        className="group relative flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
        onClick={showModal}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-yellow-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center space-x-4 relative z-10">
          <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-md">
            <img 
              src="/momo.jpg" 
              alt="MTN MoMo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <span className="text-lg font-semibold text-white font-poppins">
            Pay with MTN MoMo
          </span>
        </div>
      </motion.button>

      <Modal
        title={
          <div className="flex items-center space-x-3 px-2 py-4 border-b border-gray-100">
            <FaMobileAlt className="text-2xl text-yellow-500" />
            <div>
              <h3 className="text-xl font-semibold text-gray-800 font-poppins">
                MTN Mobile Money Payment
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your phone number to proceed
              </p>
            </div>
          </div>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={480}
        className="custom-modal"
        centered
      >
        <Form 
          form={form} 
          onFinish={handlePaymentRequest} 
          layout="vertical"
          className="px-2 py-4"
        >
          {/* Amount Display */}
          <div className="mb-6 bg-green-50 rounded-xl p-6 text-center">
            <p className="text-sm text-green-600 font-medium mb-2">Amount to Pay</p>
            <div className="flex items-center justify-center space-x-2">
              <FaMoneyBillWave className="text-2xl text-green-600" />
              <span className="text-3xl font-bold text-green-700 font-poppins">
                RWF {formattedAmount}
              </span>
            </div>
          </div>

          {/* Phone Number Input */}
          <Form.Item
            label={
              <span className="text-gray-700 font-medium font-poppins">
                Phone Number
              </span>
            }
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your phone number!" },
              { pattern: /^07[89]\d{7}$/, message: "Please enter a valid MTN number!" }
            ]}
          >
            <Input
              prefix={<span className="text-gray-400">+250</span>}
              type="tel"
              placeholder="7X XXX XXXX"
              className="h-12 text-lg font-poppins"
              style={{
                borderRadius: '0.75rem',
              }}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-0 mt-6">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-4 rounded-xl text-white text-lg font-semibold font-poppins
                ${isLoading 
                  ? 'bg-green-600/70 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 transform transition-all duration-300'
                }
              `}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                'Confirm Payment'
              )}
            </motion.button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Custom Modal Styles */}
      <style jsx global>{`
        .custom-modal .ant-modal-content {
          border-radius: 1rem;
          overflow: hidden;
        }
        
        .custom-modal .ant-modal-header {
          border-bottom: none;
          padding: 0;
        }
        
        .custom-modal .ant-modal-body {
          padding: 0;
        }
        
        .custom-modal .ant-input-affix-wrapper {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 2px solid #e5e7eb;
        }
        
        .custom-modal .ant-input-affix-wrapper:hover,
        .custom-modal .ant-input-affix-wrapper:focus,
        .custom-modal .ant-input-affix-wrapper-focused {
          border-color: #059669;
          box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1);
        }
        
        .custom-modal .ant-form-item-explain-error {
          font-size: 0.875rem;
          margin-top: 0.5rem;
          color: #ef4444;
        }

        @font-face {
          font-family: 'Poppins';
          src: url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        }

        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default MtnMoMoButton;
