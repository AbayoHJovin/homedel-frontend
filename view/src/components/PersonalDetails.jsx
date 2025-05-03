/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import { apiUrl } from "../lib/apis";
import UserNav from "./UserAccountNav";
import axios from "axios";
import Loader3 from "./Loading3";
import { toast, ToastContainer } from "react-toastify";
import { message } from "antd";
import { FaUserAlt } from "react-icons/fa";
import { motion } from "framer-motion";

// Mock data for demonstration
const DEMO_ADDRESSES = [
  {
    id: 1,
    name: "Home Address",
    street: "123 Green Avenue",
    city: "Cityville",
    state: "State",
    zip: "12345",
    country: "United States",
    default: true,
  },
  {
    id: 2,
    name: "Office Address",
    street: "456 Business Park",
    city: "Commerce City",
    state: "State",
    zip: "67890",
    country: "United States",
    default: false,
  },
];

const DEMO_PAYMENT_METHODS = [
  {
    id: 1,
    type: "VISA",
    last4: "4242",
    expiry: "12/25",
    default: true,
  },
  {
    id: 2,
    type: "MC",
    last4: "8888",
    expiry: "06/26",
    default: false,
  },
];

const DEMO_RECENT_ACTIVITY = [
  {
    id: 1,
    icon: "📦",
    description: "Order #1234 was delivered",
    date: "2 days ago",
  },
  {
    id: 2,
    icon: "💰",
    description: "You saved $25 with your recent purchase",
    date: "1 week ago",
  },
  {
    id: 3,
    icon: "⭐",
    description: "You left a review for Cotton T-shirt",
    date: "2 weeks ago",
  },
];

const PersonalDetails = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    profilePicture: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        id: currentUser.userId,
        name: currentUser.username,
        email: currentUser.email,
        profilePicture: currentUser.profilePicture,
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: file,
          previewImage: imageDataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formDatas = new FormData();
      formDatas.append("userId", formData.id);
      formDatas.append("username", formData.name);
      formDatas.append("email", formData.email);
      if (formData.profilePicture instanceof File) {
        formDatas.append("image", formData.profilePicture);
      }
      setIsSaving(true);
      const response = await axios.patch(
        `${apiUrl}/user/update?userId=${formData.id}`,
        formDatas,
        {
          headers: { "Content-Type": "multipart/form-data" },
          credentials: "include",
        }
      );

      if (response.status === 200) {
        setIsEditing(false);
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: formData.id,
            username: formData.name,
            email: formData.email,
            profilePicture: response.data.user.profilePicture,
          })
        );
        message.success("User updated successfully!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Enhanced user data with fallbacks for UI rendering
  const getUserData = () => {
    if (!currentUser) return null;

    return {
      ...currentUser,
      orders: currentUser.orders || [],
      created: currentUser.created || "2023-01-01",
      wishlist: currentUser.wishlist || [],
      reviews: currentUser.reviews || [],
      addresses: currentUser.addresses || DEMO_ADDRESSES,
      paymentMethods: currentUser.paymentMethods || DEMO_PAYMENT_METHODS,
      recentActivity: currentUser.recentActivity || DEMO_RECENT_ACTIVITY,
    };
  };

  const userData = getUserData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          <div className="text-center space-y-6">
            <div className="inline-block p-4 bg-green-100 dark:bg-green-900/50 rounded-full">
              <FaUserAlt className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Access Restricted
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please sign in or create an account to view and manage your
                profile.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-200 font-medium"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-400 transition-all duration-200 font-medium"
              >
                Create Account
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-30">
        <UserNav currentBar="Personal Details" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Profile Section */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 md:p-8"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Profile Information
            </h2>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  <img
                    src={
                      formData.previewImage ||
                      formData.profilePicture ||
                      "/default-avatar.png"
                    }
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-green-50 dark:ring-green-900"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  {isEditing && (
                    <label
                      htmlFor="profile-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <span className="text-white text-sm font-medium">
                        Change Photo
                      </span>
                    </label>
                  )}
                  <input
                    type="file"
                    id="profile-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    disabled={!isEditing}
                  />
                </motion.div>
                {isEditing && (
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Click to upload new photo
                  </p>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-colors duration-200 ${
                        isEditing
                          ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:border-green-600"
                          : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-colors duration-200 ${
                        isEditing
                          ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:border-green-600"
                          : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 sm:space-x-4 pt-2 sm:pt-4">
                  {isEditing ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsEditing(false)}
                        className="px-4 sm:px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-sm sm:text-base"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base"
                    >
                      Edit Profile
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Sections */}

          {/* Shipping and Payment Info */}
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalDetails;
