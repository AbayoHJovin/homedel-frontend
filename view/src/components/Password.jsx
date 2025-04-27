import { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Using lucide-react icons for password visibility toggle
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { apiUrl } from "../lib/apis";
import { CurrentUserContext } from "../../constants/currentUser";
import Loader3 from "./Loading3";
import { ToastContainer } from "react-toastify";
import { Modal } from "antd";
import { showSuccessToast, showErrorToast } from "../utils/toastConfig.jsx";

const Password = () => {
  const [isChanging, setIsChanging] = useState(false);
  const [step, setStep] = useState(1);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const { currentUser } = useContext(CurrentUserContext);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleChangePassword = () => {
    setIsChanging(true);
  };

  const handleCancel = () => {
    setIsChanging(false);
    setStep(1);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    fetch(`${apiUrl}/updatePassword`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentUser.email,
        newPassword: newPassword,
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === "Password updated successfully") {
          showModal();
        } else {
          setError(data.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setIsChanging(false);
      });

    handleCancel();
  };
  function handleContinue(e) {
    e.preventDefault();
    setLoading(true);
    fetch(`${apiUrl}/checkPassword`, {
      method: "GET",
      headers: { email: currentUser.email, password: oldPassword },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message !== "Password is valid") {
          showErrorToast("Invalid password");
        } else {
          setStep(2);
        }
      })
      .catch((e) => {
        console.error(e);
        showErrorToast("Error checking password");
      })
      .finally(() => setLoading(false));
  }
  return (
    <div>
      <div className="flex justify-center items-center absolute h-screen">
        <Modal
          title="Password Changed"
          visible={isModalVisible}
          onOk={handleOk}
          footer={[
            <button
              key="ok"
              onClick={handleOk}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              OK
            </button>,
          ]}
          centered
        >
          <p>Your password has been successfully changed.</p>
        </Modal>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
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
        <div className="w-full max-w-md">
          {!isChanging ? (
            <button
              onClick={handleChangePassword}
              className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-all duration-500 transform hover:scale-105"
            >
              Change Password
            </button>
          ) : (
            <div
              className={`transition-all duration-500 ${
                step === 1 ? "translate-x-0" : "translate-x-2"
              }`}
            >
              {step === 1 && (
                <form onSubmit={handleContinue} className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Enter Old Password
                  </h2>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                      Old Password
                    </label>
                    <div className="flex p-5 bg-[#e6fad9] items-center border-l-4 outline-none border-green-800 rounded-md">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Enter old password"
                        className=" w-full bg-[#e6fad9] outline-none text-gray-700 "
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="text-gray-500 dark:text-gray-400 mx-3 focus:outline-none"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5 justify-center w-full">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition w-full sm:w-auto">
                      {loading ? <Loader3 /> : "Continue"}
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Enter New Password
                  </h2>

                  {/* New Password Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                      New Password
                    </label>
                    <div className="relative flex items-center border-l-4 border-green-800 rounded-md">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900 outline-none text-gray-700 dark:text-gray-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 text-gray-600 dark:text-gray-300"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative flex items-center border-l-4 border-green-800 rounded-md">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full p-5 bg-[#e6fad9] dark:bg-gray-900 outline-none text-gray-700 dark:text-gray-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 text-gray-600 dark:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>

                  <div className="flex flex-col md:flex-row gap-5 justify-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition w-full sm:w-auto"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition w-full sm:w-auto"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Password;
