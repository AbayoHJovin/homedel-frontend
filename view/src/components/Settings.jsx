import { useContext, useState } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import {
  Moon,
  Sun,
  Globe,
  Shield,
  Lock,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { apiUrl } from "../lib/apis";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguageContext } from "../context/LanguageProvider";
import LanguageSelector from "./LanguageSelector";

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useContext(CurrentUserContext);

  // Use the language context for translation only
  const { t } = useLanguageContext();

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [name]: value });

    // Clear errors when typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordFormData.oldPassword.trim()) {
      newErrors.oldPassword = t(
        "settings.security.passwordForm.currentRequired"
      );
    }

    if (!passwordFormData.newPassword.trim()) {
      newErrors.newPassword = t("settings.security.passwordForm.newRequired");
    } else if (passwordFormData.newPassword.length < 8) {
      newErrors.newPassword = t("settings.security.passwordForm.minLength");
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      newErrors.confirmPassword = t(
        "settings.security.passwordForm.passwordsMatch"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();

    // Reset states
    setSuccessMessage("");

    // Validate form
    if (!validatePasswordForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${apiUrl}/updatePassword`,
        {
          oldPassword: passwordFormData.oldPassword,
          newPassword: passwordFormData.newPassword,
          confirmPassword: passwordFormData.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        },
      );

      if (response.status === 200) {
        // Success
        setSuccessMessage(t("settings.security.passwordForm.updateSuccess"));
        toast.success(t("settings.security.passwordForm.updateSuccess"));

        // Reset form
        setPasswordFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Close modal after a delay
        setTimeout(() => {
          setShowPasswordModal(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating password:", error);

      // Handle specific error responses
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          if (data.message === "Incorrect old password") {
            setErrors({
              ...errors,
              oldPassword: t("settings.security.passwordForm.currentIncorrect"),
            });
            toast.error(t("settings.security.passwordForm.currentIncorrect"));
          } else if (
            data.message === "New password and confirmation do not match"
          ) {
            setErrors({
              ...errors,
              confirmPassword: t(
                "settings.security.passwordForm.passwordsMatch"
              ),
            });
            toast.error(t("settings.security.passwordForm.passwordsMatch"));
          } else {
            toast.error(
              data.message || t("settings.security.passwordForm.error")
            );
          }
        } else if (status === 401) {
          toast.error(t("settings.security.passwordForm.sessionExpired"));
          // Optionally, redirect to login page
        } else {
          toast.error(t("settings.security.passwordForm.error"));
        }
      } else {
        toast.error(t("settings.security.passwordForm.networkError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowPasswordModal(false);
    setPasswordFormData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("settings.title")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t("settings.subtitle")}
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Appearance */}
        <motion.section
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Sun className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            <span>{t("settings.appearance.title")}</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                  {t("settings.appearance.darkMode")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("settings.appearance.darkModeDescription")}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                style={{
                  backgroundColor: theme === "dark" ? "#10B981" : "#D1D5DB",
                }}
              >
                <span
                  className="inline-block w-4 h-4 transform transition-transform bg-white rounded-full"
                  style={{
                    transform: `translateX(${
                      theme === "dark" ? "24px" : "4px"
                    })`,
                  }}
                />
                {theme === "dark" ? (
                  <Moon className="h-3 w-3 text-gray-800 absolute left-1.5" />
                ) : (
                  <Sun className="h-3 w-3 text-yellow-500 absolute right-1.5" />
                )}
              </button>
            </div>
          </div>
        </motion.section>

        {/* Language & Region */}
        <motion.section
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            <span>{t("settings.language.title")}</span>
          </h2>
          <div className="space-y-4">
            <LanguageSelector asMenuItem={false} />
          </div>
        </motion.section>

        {/* Privacy & Security */}
        <motion.section
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            <span>{t("settings.security.title")}</span>
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t("settings.security.changePassword")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t("settings.security.changePasswordDesc")}
                </p>
              </div>
              <Lock className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </motion.section>

        {/* Save Button */}
        <motion.div variants={itemVariants} className="flex justify-end mt-8">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            {t("settings.saveChanges")}
          </button>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-auto"
            >
              <div className="p-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t("settings.security.changePassword")}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {successMessage ? (
                  <div className="text-center py-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="mt-3 text-gray-800 dark:text-gray-200">
                      {successMessage}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitPasswordChange}>
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("settings.security.passwordForm.currentPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showOldPassword ? "text" : "password"}
                            name="oldPassword"
                            value={passwordFormData.oldPassword}
                            onChange={handlePasswordInputChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg ${
                              errors.oldPassword
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200 dark:focus:border-green-500"
                            } transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.oldPassword && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.oldPassword}
                          </p>
                        )}
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("settings.security.passwordForm.newPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={passwordFormData.newPassword}
                            onChange={handlePasswordInputChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg ${
                              errors.newPassword
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200 dark:focus:border-green-500"
                            } transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.newPassword}
                          </p>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {t("settings.security.passwordForm.confirmPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={passwordFormData.confirmPassword}
                            onChange={handlePasswordInputChange}
                            className={`w-full px-3 py-2 pr-10 border rounded-lg ${
                              errors.confirmPassword
                                ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-500"
                                : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-200 dark:focus:border-green-500"
                            } transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3"
                      >
                        {isSubmitting
                          ? t("settings.security.passwordForm.updating")
                          : t("settings.security.passwordForm.update")}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        {t("settings.security.passwordForm.cancel")}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Settings;
