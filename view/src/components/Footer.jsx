import { useContext, useState } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { apiUrl } from "../lib/apis";
import { toast, ToastContainer } from "react-toastify";
import Loader3 from "./Loading3";

const Footer = () => {
  const navigate = useNavigate();
  const { isAnAdmin } = useContext(CurrentUserContext);
  const [email, setEmail] = useState("");
  const [error, seterror] = useState("");
  const [loading, setLoading] = useState(false);
  function handleSubscribe() {
    if (email == "" || email.trim == "") {
      seterror("Pleas enter your email");
      return;
    }
    setLoading(true);
    fetch(`${apiUrl}/addSubscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.message === "Subscription successful!") {
          toast.success("Subscription added !");
        } else {
          seterror(data.message);
        }
      })
      .catch((e) => console.error("fjdsk", e))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <ToastContainer position="bottom-right" />
      <div className="relative bottom-0 bg-gray-800 text-black dark:text-white py-10 px-5 mt-10 md:px-20 overflow-hidden footer-curved-background">
        <div className="container mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col sssm:flex-row sssm:space-x-20 mb-10 md:mb-0">
            <div className="mb-8 md:mb-0">
              <h3 className="font-semibold text-white mb-4">SHOP</h3>
              <ul className="space-y-2 text-gray-200">
                <li>
                  <h1
                    onClick={() => navigate("/shop/Unisex/pants")}
                    className="hover:underline cursor-pointer"
                  >
                    Pants
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Unisex/pants")}
                    className="hover:underline cursor-pointer"
                  >
                    Shorts
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Unisex/shirts")}
                    className="hover:underline cursor-pointer"
                  >
                    Shirts
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Unisex/shirts")}
                    className="hover:underline cursor-pointer"
                  >
                    T-shirts
                  </h1>
                </li>
                <li>
                  <h1
                    onClick={() => navigate("/shop/Unisex/shoes")}
                    className="hover:underline cursor-pointer"
                  >
                    Shoes
                  </h1>
                </li>
              </ul>
            </div>
            <div className="mb-8 md:mb-0">
              <h3 className="font-semibold mb-4 text-white">HELP</h3>
              <ul className="space-y-2 text-gray-200">
                <li>
                  <a href="/contacts" className="hover:underline">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:underline">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-8 md:mb-0">
              <h3 className="font-semibold mb-4 text-white">ABOUT</h3>
              <ul className="space-y-2 text-gray-200">
                <li>
                  <a href="#" className="hover:underline">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Our locations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Our team
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <h3 className="font-semibold mb-4 text-center md:text-left text-white">
              Sign up to get 10% off your first order
            </h3>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="px-4 py-2 rounded-full text-black border border-gray-300 focus:outline-none w-full md:w-auto"
              />

              <button
                onClick={handleSubscribe}
                className="bg-[#04a56d] text-white px-4 text-center py-2 rounded-full w-full md:w-auto"
              >
                {loading ? (
                  <div className="flex items-center p-0 justify-center">
                    <Loader3 bg="white" />
                    <span>wait ...</span>
                  </div>
                ) : (
                  "Subscribe"
                )}
              </button>
            </div>
            <div className="text-red-500">{error}</div>
            <div className="flex justify-center md:justify-start space-x-3 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" text-white hover:text-[#E4405F]"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" text-white hover:text-[#1877F2]"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className=" text-white hover:text-[#1DA1F2]"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#0077B5]"
              >
                <FaLinkedinIn size={24} />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#09b347]"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-sm relative z-10 text-white">
          <p>© 2024 HomeDel, Inc. All Rights Reserved</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            {isAnAdmin ? (
              <a href="/try/admin/auth" className="hover:underline">
                admin
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="bg-gray-200 text-center">
        <h1>Made by Hirwa Jovin</h1>
      </div>
    </div>
  );
};

export default Footer;
