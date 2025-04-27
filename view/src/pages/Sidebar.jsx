/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const Sidebar = ({
  labels,
  handleConfirmLogout,
  isLoggingOut,
  activeTab,
  onTabChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update current label
  useEffect(() => {
    setCurrentLabel(labels.find((item) => item.value === activeTab) || null);
  }, [labels, activeTab]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (isLoggingOut) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Signing out...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
        <img
          src="/logo.svg"
          alt="logo"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`flex h-[calc(100vh-56px)] lg:h-screen`}>
        <div
          className={`
            fixed lg:static inset-0 z-40
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-all duration-300 ease-in-out
            ${isCollapsed ? 'w-20' : 'w-72'}
            bg-white dark:bg-gray-800 shadow-xl
          `}
        >
          {/* Sidebar Header */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              {!isCollapsed && (
                <img
                  src="/logo.svg"
                  alt="logo"
                  className="h-8 cursor-pointer"
                  onClick={() => navigate("/")}
                />
              )}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden lg:block"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {labels.map((label) => (
                  <button
                    key={label.value}
                    onClick={() => {
                      onTabChange(label.value);
                      if (isMobile) setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${activeTab === label.value
                        ? 'bg-green-600 text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span className="flex-shrink-0">{label.icon}</span>
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-medium">{label.text}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 space-y-2">
              <button
                onClick={openModal}
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">Logout</span>
                )}
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowUpRight className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">Back to Store</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto p-6">
            {currentLabel?.page}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <Modal
        isModalOpen={isModalOpen}
        handleConfirmLogout={handleConfirmLogout}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Sidebar;
