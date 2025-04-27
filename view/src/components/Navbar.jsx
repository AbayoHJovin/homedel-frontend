/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState, memo } from "react";
import { Menu, X } from "lucide-react";
import { Drawer, List, ListItem, Badge } from "@mui/material";
import CartItems, { CartContext } from "../../constants/cartItems";
import Search from "./searchComponent";
import { SearchIcon, ShoppingCart, UserPlus, Home, Info, Store, Phone, User } from "lucide-react";
import { ThemeContext } from "../../constants/ThemeContext";
import useProducts from "../../constants/products";
import { motion } from "framer-motion";

const MemoizedSearch = memo(Search);

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { itemsOnCart, addItemOncart, deleteItem } = useContext(CartContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { products, loading, error } = useProducts();
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "About", href: "/about", icon: <Info className="w-4 h-4" /> },
    { name: "Shop", href: "/shop/Unisex/pants", icon: <Store className="w-4 h-4" /> },
    { name: "Contacts", href: "/contacts", icon: <Phone className="w-4 h-4" /> },
    { name: "Account", href: "/account/account", icon: <User className="w-4 h-4" /> },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <CartItems>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a 
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <img
                src="/mobileLogo.svg"
                alt="logo"
                className="h-12 w-auto"
              />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-8">
              <div className="flex space-x-6">
                {links.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                      isActive(link.href)
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                    }`}
                  >
                    {link.icon}
                    {link.name}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"
                        initial={false}
                      />
                    )}
                  </motion.a>
                ))}
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalVisible(true)}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SearchIcon className="w-5 h-5" />
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="/cart"
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Badge
                    badgeContent={itemsOnCart.length}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#059669",
                        color: "white",
                      },
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Badge>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href="/signup"
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <UserPlus className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="sm:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleDrawer(true)}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            className: "w-[280px] bg-white dark:bg-gray-900 backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95",
            style: { boxShadow: "none" }
          }}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <img src="/mobileLogo.svg" alt="logo" className="h-8 w-auto" />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleDrawer(false)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="space-y-2">
              {links.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={toggleDrawer(false)}
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </motion.a>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsModalVisible(true);
                    setDrawerOpen(false);
                  }}
                  className="flex flex-col items-center gap-1 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SearchIcon className="w-6 h-6" />
                  <span className="text-xs">Search</span>
                </motion.button>

                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href="/cart"
                  className="flex flex-col items-center gap-1 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Badge
                    badgeContent={itemsOnCart.length}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#059669",
                        color: "white",
                      },
                    }}
                  >
                    <ShoppingCart className="w-6 h-6" />
                  </Badge>
                  <span className="text-xs">Cart</span>
                </motion.a>

                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href="/signup"
                  className="flex flex-col items-center gap-1 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <UserPlus className="w-6 h-6" />
                  <span className="text-xs">Sign Up</span>
                </motion.a>
              </div>
            </div>
          </div>
        </Drawer>
      </motion.nav>

      <MemoizedSearch
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        searchResults={products || []}
        loading={loading}
        handleAddToCart={addItemOncart}
        handleDeleteItem={deleteItem}
        localCart={itemsOnCart}
        localFav={[]}
        theme={theme}
      />
    </CartItems>
  );
}
