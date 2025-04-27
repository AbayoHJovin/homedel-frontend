import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Shield,
  Lock,
  AlertTriangle,
  CheckCircle,
  Mail,
  Key,
  Smartphone,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../lib/apis";
import { showSuccessToast, showErrorToast } from "../utils/toastConfig.jsx";

const SecurityTip = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
    <div className="flex-shrink-0">
      <Icon className="h-6 w-6 text-green-500 dark:text-green-400" />
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  </div>
);

const SecurityAlert = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isReporting, setIsReporting] = useState(false);
  const token = searchParams.get("token");

  const handleReportSuspiciousActivity = async () => {
    setIsReporting(true);
    try {
      const response = await fetch(`${apiUrl}/report-suspicious`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        showSuccessToast(
          "Thank you for reporting. We'll investigate this activity."
        );
      } else {
        throw new Error("Failed to report suspicious activity");
      }
    } catch (error) {
      showErrorToast(
        "Failed to report suspicious activity. Please contact support."
      );
    } finally {
      setIsReporting(false);
    }
  };

  const securityTips = [
    {
      icon: Lock,
      title: "Use Strong Passwords",
      description:
        "Create unique passwords with a mix of letters, numbers, and symbols. Avoid using personal information.",
    },
    {
      icon: Mail,
      title: "Watch for Phishing",
      description:
        "Be cautious of unexpected emails asking for personal information or containing suspicious links.",
    },
    {
      icon: Key,
      title: "Enable Two-Factor Authentication",
      description:
        "Add an extra layer of security by enabling 2FA on your account when available.",
    },
    {
      icon: Smartphone,
      title: "Secure Your Devices",
      description:
        "Keep your devices updated and use security software to protect against malware.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Security Alert
          </h2>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            We've detected a password reset request that you didn't initiate
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-green-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Protect Your Account
            </h3>
          </div>

          <div className="space-y-4">
            {securityTips.map((tip, index) => (
              <SecurityTip key={index} {...tip} />
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleReportSuspiciousActivity}
              disabled={isReporting}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isReporting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Reporting...
                </span>
              ) : (
                "Report Suspicious Activity"
              )}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:border-gray-600"
            >
              Return to Login
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Need help? Contact our{" "}
            <a
              href="/support"
              className="font-medium text-green-600 hover:text-green-500 dark:text-green-400"
            >
              support team
            </a>
          </p>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={1}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default SecurityAlert;
