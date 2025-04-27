/* eslint-disable no-unused-vars */
import Sidebar from "./Sidebar";
import PersonalDetails from "../components/PersonalDetails";
import Orders from "../../admin/Orders";
import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../constants/ThemeContext";
import { CurrentUserContext } from "../../constants/currentUser";
import LogoutModal from "./logout";
import Loader from "../components/loader";
import { toast } from "react-toastify";
import { apiUrl } from "../lib/apis";
import { Heart, List, Lock, LogOut, User2, UserX, ArrowRight, ShoppingBag } from "lucide-react";
import Offers from "../../constants/Offers";
import Password from "../components/Password";
import { useNavigate, useParams } from "react-router-dom";
import FavProducts from "../components/Favourites";
import { motion } from "framer-motion";

const NewAccount = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { option } = useParams();
  const [bar, setBar] = useState(option || "personal");
  useEffect(() => {
    setBar(option || "personal");
  }, [option]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/protected`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Unauthorized") {
          console.log("error in viewing account data", data);
          setIsSignedIn(false);
        } else if (data.message === "Authorized") {
          setIsSignedIn(true);
        } else {
          setIsSignedIn(false);
        }
      })
      .catch((e) => {
        console.log("Error while checking the user", e);
        setIsSignedIn(false);
      });
  }, []);
  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    fetch(`${apiUrl}/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      })
      .catch(() => {
        toast.error("Can't logout!");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };
  useEffect(()=>{
    console.log("Current user is ",currentUser)
  },[currentUser])
  const labels = [
    {
      icon: <User2 />,
      text: "Account",
      value: "account",
      page: <PersonalDetails />,
    },
    {
      icon: <List />,
      text: "Orders",
      value: "orders",
      page: (
        <Offers>
          <Orders
            AdminOptions={false}
            currentUser={currentUser ? currentUser.userId : null}
          />
        </Offers>
      ),
    },
    {
      icon: <Lock />,
      text: "Password",
      value: "password",
      page: <Password />,
    },
    {
      icon:<Heart/>,
      text:"Wishlist",
      value:"wishlist",
      page:<FavProducts/>
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {isSignedIn ? (
        <Sidebar
          labels={labels}
          handleConfirmLogout={handleConfirmLogout}
          isLoggingOut={isLoggingOut}
          activeTab={bar}
          onTabChange={(newTab) => {
            setBar(newTab);
            window.location.href=`/account/${newTab}`;
          }}
        />
      ) : (
        <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 lg:p-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl"
          >
            {/* Main Card */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-2xl shadow-xl overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 sm:p-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6">
                  <UserX className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Not Signed In
                </h2>
                <p className="text-green-100 text-lg">
                  Access your account to unlock all features
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-8 sm:p-10">
                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <motion.div 
                    variants={itemVariants}
                    className={`p-6 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
                    }`}
                  >
                    <ShoppingBag className="w-8 h-8 text-green-600 mb-4" />
                    <h3 className={`text-lg font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Track Orders</h3>
                    <p className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>Monitor your orders and get real-time updates</p>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    className={`p-6 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
                    }`}
                  >
                    <Heart className="w-8 h-8 text-green-600 mb-4" />
                    <h3 className={`text-lg font-semibold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Save Favorites</h3>
                    <p className={`${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>Create your wishlist and save items for later</p>
                  </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row gap-4 mt-8"
                >
                  <motion.a 
                    href="/signup"
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button className="w-full px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center">
                      Create Account
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </motion.a>

                  <motion.a 
                    href="/login"
                    className="flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button className="w-full px-6 py-3 text-lg font-medium border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center">
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>

            {/* Footer Text */}
            <motion.p 
              variants={itemVariants}
              className={`text-center mt-6 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              By signing up, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NewAccount;
