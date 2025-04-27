import { toast } from "react-toastify";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";

// Custom Toast Components
const SuccessToast = ({ message }) => (
  <div className="flex items-center bg-white rounded-lg shadow-md">
    <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
    <div className="py-2">
      <h4 className="font-semibold text-gray-900">Success</h4>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

SuccessToast.propTypes = {
  message: PropTypes.string.isRequired,
};

const ErrorToast = ({ message }) => (
  <div className="flex items-center bg-red-500 rounded-lg shadow-md">
    <XCircle className="w-6 h-6 text-white mr-3 flex-shrink-0" />
    <div className="py-2">
      <h4 className="font-semibold text-white">Error</h4>
      <p className="text-white text-sm opacity-90">{message}</p>
    </div>
  </div>
);

ErrorToast.propTypes = {
  message: PropTypes.string.isRequired,
};

const WarningToast = ({ message }) => (
  <div className="flex items-center bg-yellow-50 rounded-lg shadow-md border border-yellow-100">
    <AlertCircle className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
    <div className="py-2">
      <h4 className="font-semibold text-gray-900">Warning</h4>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  </div>
);

WarningToast.propTypes = {
  message: PropTypes.string.isRequired,
};

// Toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  progress: undefined,
  className: "!bg-transparent !shadow-none",
  bodyClassName: "!p-0",
  closeButton: ({ closeToast }) => (
    <button
      onClick={closeToast}
      className="!text-current opacity-70 hover:opacity-100 absolute right-1 top-1"
    >
      ×
    </button>
  ),
  limit: 1, // Only show one toast at a time
  transition: "Slide",
};

// Toast functions
export const showSuccessToast = (message) => {
  // Dismiss all existing toasts before showing new one
  toast.dismiss();
  toast.success(<SuccessToast message={message} />, {
    ...toastConfig,
  });
};

export const showErrorToast = (message) => {
  // Dismiss all existing toasts before showing new one
  toast.dismiss();
  toast.error(<ErrorToast message={message} />, {
    ...toastConfig,
  });
};

export const showWarningToast = (message) => {
  // Dismiss all existing toasts before showing new one
  toast.dismiss();
  toast.warning(<WarningToast message={message} />, {
    ...toastConfig,
  });
};

// Error handling utility
export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const errorMessage = error.response.data?.message || "An error occurred";
    showErrorToast(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    showErrorToast("No response from server. Please check your connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    showErrorToast(error.message || "An unexpected error occurred");
  }
};
