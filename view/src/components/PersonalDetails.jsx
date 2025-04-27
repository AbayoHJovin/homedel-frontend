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

const PersonalDetails = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, isAnAdmin } = useContext(CurrentUserContext);
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: file, // Store file for backend
          previewImage: imageDataUrl, // Preview in the UI
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
        formDatas.append("image", formData.profilePicture); // Send file to backend
      }
      setIsSaving(true);
      const response = await axios.patch(
        `${apiUrl}/user/update?userId=${formData.id}`,
        formDatas,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setIsEditing(false);
        sessionStorage.setItem(
          "User",
          JSON.stringify({
            id: formData.id,
            username: formData.name,
            email: formData.email,
            profilePicture: response.data.user.profilePicture,
          })
        );
        message.success("User updated successfully!");
        setIsSaving(false);
      } else {
        console.error("Failed to update user:", response.data);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="inline-block p-4 bg-green-100 dark:bg-green-900/50 rounded-full">
              <FaUserAlt className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            
            {/* Text Content */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Access Restricted
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please sign in or create an account to view and manage your profile.
              </p>
            </div>

            {/* Buttons */}
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Profile Information
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <img
                    src={formData.previewImage || formData.profilePicture}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-green-50 dark:ring-green-900"
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
                </div>
                {isEditing && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload new photo
                  </p>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        isEditing
                          ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:border-green-600"
                          : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                        isEditing
                          ? "border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:border-green-600"
                          : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Subscription Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Newsletter Subscription
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Stay updated with our latest products and offers by subscribing to our newsletter.
              </p>
              <button className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                Subscribe Now
              </button>
            </div>

            {/* Security Section */}
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Security
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Manage your account security and password settings.
                </p>
                <button
                  onClick={() => window.location.href = "/account/password"}
                  className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Change Password
                </button>
              </div>

              {/* Danger Zone */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border-t-4 border-red-500">
                <h3 className="text-xl font-semibold text-red-600 mb-4">
                  Danger Zone
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
