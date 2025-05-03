// import { CheckCheckIcon, Clock, ShoppingBasket, Trash } from "lucide-react";
// import { AiOutlineOrderedList } from "react-icons/ai";
// import { CgShutterstock } from "react-icons/cg";
// import { FaMoneyCheck, FaTrophy } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { User, LayoutDashboard } from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Header from "../admin/AdminNav";
import UseUsers from "../constants/Users";
import useProducts from "../constants/products";
import { useContext } from "react";
import { OffersContext } from "../constants/Offers";
// import Loader3 from "../src/components/Loading3";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { users = [] } = UseUsers();
  const {
    products = [],
    popularProds = [],
    loading: productsLoading,
    error: productsError,
  } = useProducts();
  const {
    kigali = [],
    north = [],
    south = [],
    east = [],
    west = [],
    allOffers = [],
    pending = [],
    approved = [],
    isLoading: offersLoading,
    error: offersError,
  } = useContext(OffersContext);

  // Loading/Error states
  if (productsLoading || offersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header currentBar="Dashboard" />
        <div className="mt-20 text-green-700 text-lg font-semibold animate-pulse">
          Loading dashboard data...
        </div>
      </div>
    );
  }
  if (productsError || offersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Header currentBar="Dashboard" />
        <div className="mt-20 text-red-600 text-lg font-semibold">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  // --- Cards Data ---
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalPopular = popularProds.length;

  // --- Orders by Area (Bar Chart) ---
  const ordersData = [
    { province: "Kigali", orders: kigali.length },
    { province: "Southern", orders: south.length },
    { province: "Western", orders: west.length },
    { province: "Northern", orders: north.length },
    { province: "Eastern", orders: east.length },
  ];
  const barData = {
    labels: ordersData.map((item) => item.province),
    datasets: [
      {
        label: "Orders",
        data: ordersData.map((item) => item.orders),
        backgroundColor: [
          "#059669",
          "#10b981",
          "#34d399",
          "#6ee7b7",
          "#a7f3d0",
        ],
        borderRadius: 8,
        borderWidth: 0,
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Orders by Area",
        color: "#059669",
        font: { size: 18, weight: "bold" },
      },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: "#059669" } },
      x: { ticks: { color: "#059669" } },
    },
    animation: { duration: 800, easing: "easeOutQuart" },
  };

  // --- Sales per Product Category (Pie Chart) ---
  const categorySales = {};
  products.forEach((p) => {
    if (!categorySales[p.category]) categorySales[p.category] = 0;
    categorySales[p.category] += p.sold || 0;
  });
  const pieCategoryData = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        data: Object.values(categorySales),
        backgroundColor: [
          "#059669",
          "#10b981",
          "#34d399",
          "#6ee7b7",
          "#a7f3d0",
        ],
        borderWidth: 0,
      },
    ],
  };
  const pieCategoryOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#059669" } },
      title: {
        display: true,
        text: "Sales per Product Category",
        color: "#059669",
        font: { size: 16, weight: "bold" },
      },
      tooltip: { enabled: true },
    },
    animation: { duration: 800, easing: "easeOutQuart" },
  };

  // --- Pending vs Approved Orders (Pie Chart) ---
  const pieStatusData = {
    labels: ["Pending", "Approved"],
    datasets: [
      {
        data: [pending.length, approved.length],
        backgroundColor: ["#f59e42", "#059669"],
        borderWidth: 0,
      },
    ],
  };
  const pieStatusOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#059669" } },
      title: {
        display: true,
        text: "Pending vs Approved Orders",
        color: "#059669",
        font: { size: 16, weight: "bold" },
      },
      tooltip: { enabled: true },
    },
    animation: { duration: 800, easing: "easeOutQuart" },
  };

  return (
    <div>
      <div className="top-0 sticky">
        <Header currentBar="Dashboard" />
      </div>
      <hr />
      <div className="min-h-screen items-center content-center">
        {/* Cards */}
        <div className="gap-6 p-6 flex flex-col sm:flex-row justify-center items-center">
          {/* Users Card */}
          <div className="bg-green-200 max-w-xs w-full p-6 z-0 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="mb-2 bg-green-600 rounded-full p-3">
              <User className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-800">{totalUsers}</h1>
            <h2 className="text-lg text-green-700 font-semibold">Users</h2>
          </div>
          {/* Products Card */}
          <div className="bg-green-100 max-w-xs w-full p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="mb-2 bg-green-500 rounded-full p-3">
              <LayoutDashboard className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-700">
              {totalProducts}
            </h1>
            <h2 className="text-lg text-green-600 font-semibold">Products</h2>
          </div>
          {/* Popular Products Card */}
          <div className="bg-green-50 max-w-xs w-full p-6 rounded-lg shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="mb-2 bg-yellow-400 rounded-full p-3">
              <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
            <h1 className="text-3xl font-bold text-yellow-700">
              {totalPopular}
            </h1>
            <h2 className="text-lg text-yellow-700 font-semibold">
              Popular Products
            </h2>
          </div>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 w-full max-w-6xl mx-auto">
          {/* Orders by Area Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-200">
            <div className="h-80 w-full">
              <Bar
                key={`bar-${barData.labels.join("-")}`}
                data={barData}
                options={barOptions}
                redraw
              />
            </div>
          </div>
          {/* Sales per Product Category Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-200">
            <div className="h-80 w-full flex items-center justify-center">
              <Pie
                key={`pie-category-${pieCategoryData.labels.join("-")}`}
                data={pieCategoryData}
                options={pieCategoryOptions}
                redraw
              />
            </div>
          </div>
          {/* Pending vs Approved Orders Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-200 md:col-span-2">
            <div className="h-80 w-full flex items-center justify-center">
              <Pie
                key={`pie-status-${pending.length}-${approved.length}`}
                data={pieStatusData}
                options={pieStatusOptions}
                redraw
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
