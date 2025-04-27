import { useState, useContext, useEffect } from "react";
import { CgInfo } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../constants/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { CartContext } from "../../constants/cartItems";
import { toast, ToastContainer } from "react-toastify";
import rwandaData from "../../constants/rwanda";

const OrderForm = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { itemsOnCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    phone: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    termsAccepted: false,
  });
  const availableProvinces = rwandaData.data.map((provinceObj) =>
    Object.keys(provinceObj)[0]
  );

  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [availableCells, setAvailableCells] = useState([]);
  const [availableVillages, setAvailableVillages] = useState([]);

  const [productsId, setProductsId] = useState([]);
  const [cost, setCost] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!currentUser || !itemsOnCart) {
      navigate("/login");
    }

    const products = itemsOnCart
      .map((item) => {
        if (item && item.productId && item.quantity) {
          return { productId: item.productId, quantity: item.quantity };
        }
        return null;
      })
      .filter(Boolean);

    setProductsId(products);
  }, [itemsOnCart, currentUser, navigate]);

  // Helper functions to get the next-level options from the JSON data

  const getDistricts = (provinceName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      // provinceObj[provinceName] is an array of district objects.
      return provinceObj[provinceName].map((districtObj) =>
        Object.keys(districtObj)[0]
      );
    }
    return [];
  };

  const getSectors = (provinceName, districtName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      const districtObj = provinceObj[provinceName].find(
        (d) => d[districtName]
      );
      if (districtObj) {
        // districtObj[districtName] is an array of sector objects.
        return districtObj[districtName].map((sectorObj) =>
          Object.keys(sectorObj)[0]
        );
      }
    }
    return [];
  };

  const getCells = (provinceName, districtName, sectorName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      const districtObj = provinceObj[provinceName].find(
        (d) => d[districtName]
      );
      if (districtObj) {
        const sectorObj = districtObj[districtName].find(
          (s) => s[sectorName]
        );
        if (sectorObj) {
          // sectorObj[sectorName] is an array of cell objects.
          return sectorObj[sectorName].map((cellObj) =>
            Object.keys(cellObj)[0]
          );
        }
      }
    }
    return [];
  };

  const getVillages = (provinceName, districtName, sectorName, cellName) => {
    const provinceObj = rwandaData.data.find((item) => item[provinceName]);
    if (provinceObj) {
      const districtObj = provinceObj[provinceName].find(
        (d) => d[districtName]
      );
      if (districtObj) {
        const sectorObj = districtObj[districtName].find(
          (s) => s[sectorName]
        );
        if (sectorObj) {
          const cellObj = sectorObj[sectorName].find(
            (c) => c[cellName]
          );
          if (cellObj) {
            // cellObj[cellName] is an array of village names.
            return cellObj[cellName];
          }
        }
      }
    }
    return [];
  };

  // Handlers for changes in the selects

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData((prev) => ({
      ...prev,
      province: selectedProvince,
      district: "",
      sector: "",
      cell: "",
      village: "",
    }));
    // Update districts based on selected province
    setAvailableDistricts(getDistricts(selectedProvince));
    // Reset lower levels
    setAvailableSectors([]);
    setAvailableCells([]);
    setAvailableVillages([]);
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData((prev) => ({
      ...prev,
      district: selectedDistrict,
      sector: "",
      cell: "",
      village: "",
    }));
    setAvailableSectors(getSectors(formData.province, selectedDistrict));
    setAvailableCells([]);
    setAvailableVillages([]);
  };

  const handleSectorChange = (e) => {
    const selectedSector = e.target.value;
    setFormData((prev) => ({
      ...prev,
      sector: selectedSector,
      cell: "",
      village: "",
    }));
    setAvailableCells(getCells(formData.province, formData.district, selectedSector));
    setAvailableVillages([]);
  };

  const handleCellChange = (e) => {
    const selectedCell = e.target.value;
    setFormData((prev) => ({
      ...prev,
      cell: selectedCell,
      village: "",
    }));
    setAvailableVillages(
      getVillages(formData.province, formData.district, formData.sector, selectedCell)
    );
  };

  const handleVillageChange = (e) => {
    const selectedVillage = e.target.value;
    setFormData((prev) => ({ ...prev, village: selectedVillage }));
  };

  // A simple change handler for the phone input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }));
  };

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const realTime = `${hours}:${minutes} ${hours >= 12 ? "PM" : "AM"}`;
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = realTime;

  const validateForm = () => {
    const errors = {};
    const {
      phone,
      province,
      district,
      sector,
      cell,
      village,
      termsAccepted,
    } = formData;

    if (!phone) errors.phone = "Phone number is required";
    if (!province) errors.province = "Province is required";
    if (!district) errors.district = "District is required";
    if (!sector) errors.sector = "Sector is required";
    if (!cell) errors.cell = "Cell is required";
    if (!village) errors.village = "Village is required";
    if (!termsAccepted)
      errors.termsAccepted = "You must accept the terms and conditions";

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      console.log("form error", errors);
    } else {
      console.log("no error!");
      // Check for required data
      if (!currentUser || !formData || !productsId || !subtotal) {
        toast.error("Missing required information!");
        return;
      }

      const dataToSend = {
        userId: currentUser.userId,
        address: [
          formData.province,
          formData.district,
          formData.sector,
          formData.cell,
          formData.village,
        ].join("-"),
        phoneNo: formData.phone,
        price: subtotal,
        products: productsId,
        orderDate: `${currentDate} ${currentTime}`,
      };

      navigate("/paymentPage", { state: { amount: subtotal, dataToSend } });
    }
  };

  // Get subtotal from location state
  const { cartTotal: subtotal } = location.state || {};
  useEffect(() => {
    if (!subtotal) {
      navigate(-1);
    } else {
      setCost(subtotal);
    }
  }, [subtotal, navigate]);

  const formattedCost = new Intl.NumberFormat("en-US").format(cost);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <ToastContainer position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col lg:flex-row items-start gap-8 ${
            theme === "dark" ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          {/* Order Form */}
          <motion.form 
            className="flex-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
            >
              Complete your order
            </motion.h2>

            {/* Personal Details Section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-6">
                Personal Details
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out"
                    type="tel"
                    minLength={10}
                    placeholder="Phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {formErrors.phone && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.phone}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Delivery Address Section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-6">
                Delivery Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Province select */}
                <div className="relative">
                  <select
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out appearance-none"
                    name="province"
                    value={formData.province}
                    onChange={handleProvinceChange}
                  >
                    <option value="" disabled>Select a province</option>
                    {availableProvinces.map((province, index) => (
                      <option key={index} value={province}>{province}</option>
                    ))}
                  </select>
                  {formErrors.province && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.province}
                    </motion.p>
                  )}
                </div>

                {/* District select */}
                <div className="relative">
                  <select
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out appearance-none"
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    disabled={!formData.province}
                  >
                    <option value="" disabled>
                      {formData.province ? "Select a district" : "Select a province first"}
                    </option>
                    {availableDistricts.map((district, index) => (
                      <option key={index} value={district}>{district}</option>
                    ))}
                  </select>
                  {formErrors.district && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.district}
                    </motion.p>
                  )}
                </div>

                {/* Sector select */}
                <div className="relative">
                  <select
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out appearance-none"
                    name="sector"
                    value={formData.sector}
                    onChange={handleSectorChange}
                    disabled={!formData.district}
                  >
                    <option value="" disabled>
                      {formData.district ? "Select a sector" : "Select a district first"}
                    </option>
                    {availableSectors.map((sector, index) => (
                      <option key={index} value={sector}>{sector}</option>
                    ))}
                  </select>
                  {formErrors.sector && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.sector}
                    </motion.p>
                  )}
                </div>

                {/* Cell select */}
                <div className="relative">
                  <select
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out appearance-none"
                    name="cell"
                    value={formData.cell}
                    onChange={handleCellChange}
                    disabled={!formData.sector}
                  >
                    <option value="" disabled>
                      {formData.sector ? "Select a cell" : "Select a sector first"}
                    </option>
                    {availableCells.map((cell, index) => (
                      <option key={index} value={cell}>{cell}</option>
                    ))}
                  </select>
                  {formErrors.cell && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.cell}
                    </motion.p>
                  )}
                </div>

                {/* Village select */}
                <div className="relative">
                  <select
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out appearance-none"
                    name="village"
                    value={formData.village}
                    onChange={handleVillageChange}
                    disabled={!formData.cell}
                  >
                    <option value="" disabled>
                      {formData.cell ? "Select a village" : "Select a cell first"}
                    </option>
                    {availableVillages.map((village, index) => (
                      <option key={index} value={village}>{village}</option>
                    ))}
                  </select>
                  {formErrors.village && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {formErrors.village}
                    </motion.p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Amount to pay Section */}
            <motion.div 
              className="mb-8 bg-green-50 dark:bg-gray-700 p-6 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
                Amount to pay
              </h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                RWF {formattedCost}
              </p>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300 transition-all duration-300"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  I agree to the terms and conditions of this service
                </span>
              </label>
              {formErrors.termsAccepted && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {formErrors.termsAccepted}
                </motion.p>
              )}
            </motion.div>

            {/* Important Information Section */}
            <motion.div 
              className="mb-8 bg-red-50 dark:bg-gray-700/50 p-6 rounded-xl flex items-start space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <CgInfo className="text-3xl text-red-500 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Note that after you click on complete purchase, you will be called
                shortly on the phone number you entered. You will pay using the
                method provided after getting your products. In case of any issues,
                call or WhatsApp us on <span className="font-semibold">+250798509561</span>.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row justify-end gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="px-6 py-3 text-base font-medium rounded-lg border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                Pay RWF {formattedCost}
              </button>
            </motion.div>
          </motion.form>

          {/* Right side image */}
          <motion.div 
            className="hidden lg:block w-1/3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="/confirmImage.png"
              alt="payment"
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderForm;
