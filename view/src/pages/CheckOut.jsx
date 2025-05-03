import { useState, useContext, useEffect } from "react";
import { CgInfo } from "react-icons/cg";
import { motion } from "framer-motion";
import { ThemeContext } from "../../constants/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../../constants/currentUser";
import { CartContext } from "../../constants/cartItems";
import { toast, ToastContainer } from "react-toastify";
import rwandaData from "../../constants/rwanda";
import UserLocation from "../components/UserLocation";
import { apiUrl } from "../lib/apis";
import { useLanguageContext } from "../context/LanguageProvider";

const OrderForm = () => {
  const { t } = useLanguageContext();
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
    street: "",
    termsAccepted: false,
  });
  const availableProvinces = rwandaData.data.map(
    (provinceObj) => Object.keys(provinceObj)[0]
  );
  console.log(currentUser);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableSectors, setAvailableSectors] = useState([]);
  const [availableCells, setAvailableCells] = useState([]);
  const [availableVillages, setAvailableVillages] = useState([]);

  const [productsId, setProductsId] = useState([]);
  const [cost, setCost] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      return provinceObj[provinceName].map(
        (districtObj) => Object.keys(districtObj)[0]
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
        return districtObj[districtName].map(
          (sectorObj) => Object.keys(sectorObj)[0]
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
        const sectorObj = districtObj[districtName].find((s) => s[sectorName]);
        if (sectorObj) {
          // sectorObj[sectorName] is an array of cell objects.
          return sectorObj[sectorName].map(
            (cellObj) => Object.keys(cellObj)[0]
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
        const sectorObj = districtObj[districtName].find((s) => s[sectorName]);
        if (sectorObj) {
          const cellObj = sectorObj[sectorName].find((c) => c[cellName]);
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
    setAvailableCells(
      getCells(formData.province, formData.district, selectedSector)
    );
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
      getVillages(
        formData.province,
        formData.district,
        formData.sector,
        selectedCell
      )
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
      street,
      termsAccepted,
    } = formData;

    if (!phone) errors.phone = t("checkout.validation.phone");
    if (!province) errors.province = t("checkout.validation.province");
    if (!district) errors.district = t("checkout.validation.district");
    if (!sector) errors.sector = t("checkout.validation.sector");
    if (!cell) errors.cell = t("checkout.validation.cell");
    if (!village) errors.village = t("checkout.validation.village");
    if (!street) errors.street = t("checkout.validation.street");
    if (!termsAccepted) errors.termsAccepted = t("checkout.validation.terms");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields correctly");
      return;
    }

      // Check for required data
    if (!currentUser) {
      toast.error(t("checkout.errors.login"));
      navigate("/login");
      return;
    }

    if (!itemsOnCart || itemsOnCart.length === 0) {
      toast.error(t("checkout.errors.emptyCart"));
      navigate("/cart");
      return;
    }

    if (!cost) {
      toast.error(t("checkout.errors.invalidOrder"));
      navigate("/cart");
      return;
    }

    // Check if location is selected
    if (!selectedLocation) {
      toast.error(t("checkout.validation.location"));
        return;
      }

    try {
      const orderData = {
        phoneNo: formData.phone,
        price: cost,
        address: [
          formData.province,
          formData.district,
          formData.sector,
          formData.cell,
          formData.village,
        ].join("-"),
        street: formData.street,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        mapAddress: selectedLocation.address,
        products: productsId,
        orderDate: `${currentDate} ${currentTime}`,
      };

      // Create the order first
      const response = await fetch(`${apiUrl}/addOffer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          orderData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("checkout.errors.orderCreation"));
      }

      // If order is created successfully, navigate to payment page
      navigate("/paymentPage", {
        state: {
          amount: cost,
          orderId: data.order.orderId,
          phoneNumber: formData.phone,
          dataToSend: true,
        },
      });
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.message || t("checkout.errors.orderCreation"));
    }
  };

  // Get subtotal from location state
  const { cartTotal: subtotal } = location.state || {};
  useEffect(() => {
    if (!subtotal) {
      toast.error(t("checkout.errors.invalidTotal"));
      navigate("/cart");
    } else {
      setCost(subtotal);
    }
  }, [subtotal, navigate, t]);

  const formattedCost = new Intl.NumberFormat("en-US").format(cost);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    // Update form data with the selected location
    setFormData((prev) => ({
      ...prev,
      deliveryAddress: location.address,
      latitude: location.lat,
      longitude: location.lng,
      mapAddress: location.address,
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <ToastContainer position="top-center" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
        >
          {/* Order Form */}
          <motion.form 
            className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-8"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
            >
              {t("checkout.title")}
            </motion.h2>

            {/* Personal Details Section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-6">
                {t("checkout.personalDetails.title")}
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out"
                    type="tel"
                    minLength={10}
                    placeholder={t("checkout.personalDetails.phone")}
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
                {t("checkout.deliveryAddress.title")}
              </h3>

              {/* Location Instructions */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">
                  {t("checkout.deliveryAddress.instructions.title")}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-blue-600 dark:text-blue-300">
                  {t("checkout.deliveryAddress.instructions.steps", {
                    returnObjects: true,
                  }).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>

              {/* Location Picker */}
              <div className="mb-6">
                <UserLocation onLocationSelect={handleLocationSelect} />
              </div>

              {/* Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Street input */}
                <div className="relative sm:col-span-2">
                  <input
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out"
                    type="text"
                    placeholder={t("checkout.deliveryAddress.form.street")}
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                  />
                  {formErrors.street && (
                    <motion.p className="text-red-500 text-sm mt-2">
                      {formErrors.street}
                    </motion.p>
                  )}
                </div>

                {/* Province select */}
                <div className="relative">
                  <select
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out appearance-none"
                    name="province"
                    value={formData.province}
                    onChange={handleProvinceChange}
                  >
                    <option value="" disabled>
                      {t("checkout.deliveryAddress.form.province")}
                    </option>
                    {availableProvinces.map((province, index) => (
                      <option key={index} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                  {formErrors.province && (
                    <motion.p className="text-red-500 text-sm mt-2">
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
                      {formData.province
                        ? t("checkout.deliveryAddress.form.district")
                        : t("checkout.deliveryAddress.form.provinceFirst")}
                    </option>
                    {availableDistricts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  {formErrors.district && (
                    <motion.p className="text-red-500 text-sm mt-2">
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
                      {formData.district
                        ? t("checkout.deliveryAddress.form.sector")
                        : t("checkout.deliveryAddress.form.districtFirst")}
                    </option>
                    {availableSectors.map((sector, index) => (
                      <option key={index} value={sector}>
                        {sector}
                      </option>
                    ))}
                  </select>
                  {formErrors.sector && (
                    <motion.p className="text-red-500 text-sm mt-2">
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
                      {formData.sector
                        ? t("checkout.deliveryAddress.form.cell")
                        : t("checkout.deliveryAddress.form.sectorFirst")}
                    </option>
                    {availableCells.map((cell, index) => (
                      <option key={index} value={cell}>
                        {cell}
                      </option>
                    ))}
                  </select>
                  {formErrors.cell && (
                    <motion.p className="text-red-500 text-sm mt-2">
                      {formErrors.cell}
                    </motion.p>
                  )}
                </div>

                {/* Village select */}
                <div className="relative sm:col-span-2">
                  <select
                    className="w-full p-4 outline-none rounded-lg border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 focus:border-green-500 transition-all duration-300 ease-in-out appearance-none"
                    name="village"
                    value={formData.village}
                    onChange={handleVillageChange}
                    disabled={!formData.cell}
                  >
                    <option value="" disabled>
                      {formData.cell
                        ? t("checkout.deliveryAddress.form.village")
                        : t("checkout.deliveryAddress.form.cellFirst")}
                    </option>
                    {availableVillages.map((village, index) => (
                      <option key={index} value={village}>
                        {village}
                      </option>
                    ))}
                  </select>
                  {formErrors.village && (
                    <motion.p className="text-red-500 text-sm mt-2">
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
                {t("checkout.payment.title")}
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
                  {t("checkout.terms.accept")}
                </span>
              </label>
              {formErrors.termsAccepted && (
                <motion.p className="text-red-500 text-sm mt-2">
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
                {t("checkout.importantInfo.content")}{" "}
                <span className="font-semibold">+250798509561</span>.
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
                {t("checkout.buttons.cancel")}
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
              >
                {t("checkout.buttons.pay")} RWF {formattedCost}
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderForm;
