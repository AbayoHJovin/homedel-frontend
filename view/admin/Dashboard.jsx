/* eslint-disable react/prop-types */
import ProductTable from "./Products";
import Orders from "./Orders";
import PopularProds from "./PopularProds";
import { apiUrl } from "../src/lib/apis";
import { LayoutDashboard } from "lucide-react";
import {
  AiFillLike,
  AiFillProduct,
  AiOutlineOrderedList,
} from "react-icons/ai";
import Sidebar from "../src/pages/Sidebar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Dashboard from "../test/Dash";
import Offers from "../constants/Offers";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { option } = useParams();
  const [bar, setBar] = useState(option || "dashboard");
  useEffect(() => {
    setBar(option || "dashboard");
  }, [option]);
  useEffect(() => {
    async function checkAdminStatus() {
      const response = await fetch(`${apiUrl}/check-admin`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.isAdmin == false) {
        navigate("/");
      }
    }
    checkAdminStatus();
  }, [navigate]);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    fetch(`${apiUrl}/admLogout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Logged out") {
          localStorage.removeItem("admTokn");
          navigate("/");
        }
      })
      .catch(() => {
        toast.error("Can't logout!");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  };
  const labels = [
    {
      icon: <LayoutDashboard />,
      text: "Dashboard",
      value: "dashboard",
      page: (
        <Offers>
          <Dashboard />
        </Offers>
      ),
    },
    {
      icon: <AiFillProduct />,
      text: "products",
      value: "products",
      page: <ProductTable />,
    },
    {
      icon: <AiFillLike />,
      text: "P.Products",
      value: "popularproducts",
      page: <PopularProds />,
    },
    {
      icon: <AiOutlineOrderedList />,
      text: "Orders",
      value: "orders",
      page: (
        <Offers>
          <Orders AdminOptions={true} />
        </Offers>
      ),
    },
  ];
  return (
    <Sidebar
      labels={labels}
      handleConfirmLogout={handleConfirmLogout}
      isLoggingOut={isLoggingOut}
      activeTab={bar}
      onTabChange={(newTab) => {
        setBar(newTab);
        window.location.href = `/authorized/Admin/${newTab}`;
      }}
    />
  );
}
