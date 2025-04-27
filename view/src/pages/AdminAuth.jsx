import { useContext, useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ReactCodeInput from "react-code-input";
import { apiUrl } from "../lib/apis";
import Loader3 from "../components/Loading3";
import { CurrentUserContext } from "../../constants/currentUser";
import { ArrowLeft, Clock } from "lucide-react";

const AdminAuth = () => {
  const navigate = useNavigate();
  const { isAnAdmin, isLoading } = useContext(CurrentUserContext);
  const [otpValue, setOtpValue] = useState("");
  const [sendOtp, setSendOtp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    if (!isLoading && isAnAdmin == false) {
      navigate("/");
    }
  }, [isAnAdmin, navigate, isLoading]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleOtpChange = (otp) => {
    setOtpValue(otp);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const startCountdown = () => {
    setCountdown(60); // 1 minute
    setCanResend(false);
  };

  function handleSendOtp() {
    setLoading(true);
    fetch(`${apiUrl}/generate-otp`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "OTP sent successfully") {
          toast.success("OTP sent to your email");
          setSendOtp(false);
          startCountdown();
        } else {
          console.error(data.message);
          toast.error("Error sending OTP");
        }
      })
      .catch((e) => {
        console.error(e);
        toast.error("Failed to send OTP");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCheckOtp() {
    setLoading(true);
    fetch(`${apiUrl}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: otpValue }),
      credentials: "include",
      mode: "cors" // Explicitly enable CORS
    })
    .then(async (response) => {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl; 
      }
    })
    .catch((error) => {
      console.error("OTP Error:", error);
      toast.error(error.message || "Invalid OTP");
    })
    .finally(() => setLoading(false));
  }

  const otpInputStyle = {
    className: "otp-input",
    inputStyle: {
      width: "3.5rem",
      height: "4rem",
      margin: "0 0.5rem",
      fontSize: "1.75rem",
      fontWeight: "600",
      borderRadius: "12px",
      border: "2px solid #E5E7EB",
      textAlign: "center",
      backgroundColor: "transparent",
      color: "currentColor",
      transition: "all 0.2s ease",
      outline: "none",
    },
    focusStyle: {
      border: "2px solid #22C55E",
      boxShadow: "0 0 0 2px rgba(34, 197, 94, 0.2)",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <ToastContainer position="top-right" />
      
      <div className="container mx-auto min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-300">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-12">
            <button
              onClick={handleGoBack}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-lg"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              <span>Back</span>
            </button>
            <img 
              src="/logo.svg" 
              alt="logo" 
              className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Admin Authentication
          </h2>

          {/* Content */}
          <div className="space-y-8">
            {sendOtp ? (
              <div className="space-y-8">
                <p className="text-center text-lg text-gray-600 dark:text-gray-300">
                  Click below to receive an OTP via email
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full max-w-sm bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {loading ? <Loader3 /> : "Send OTP"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Enter the OTP sent to your email
                  </p>
                  {countdown > 0 && (
                    <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Resend available in {formatTime(countdown)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-center my-8">
                  <ReactCodeInput
                    {...otpInputStyle}
                    type="text"
                    fields={6}
                    onChange={handleOtpChange}
                  />
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleCheckOtp}
                    disabled={loading || otpValue.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {loading ? <Loader3 /> : "Verify OTP"}
                  </button>
                  
                  <button
                    onClick={handleSendOtp}
                    disabled={!canResend}
                    className={`w-full text-green-600 hover:text-green-700 font-medium py-2 transition-colors duration-200 text-lg
                      ${!canResend ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50 dark:hover:bg-gray-700 rounded-xl'}`}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
