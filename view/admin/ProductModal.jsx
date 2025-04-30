/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { apiUrl } from "../src/lib/apis";

export default function ProductModal({
  isOpen,
  onClose,
  product,
  refreshProducts,
  categories,
  genders,
}) {
  const MAX_IMAGES = 5;
  const [formData, setFormData] = useState({
    prodName: "",
    prodDescription: "",
    price: "",
    gender: "",
    category: "",
    stock: 0,
    popular: false,
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState({
    gender: false,
    category: false,
  });
  const modalRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        prodName: product.prodName || "",
        prodDescription: product.prodDescription || "",
        price: product.price || "",
        gender: product.gender || "",
        category: product.category || "",
        stock: product.stock || 0,
        popular: product.popular || false,
        images: product.images
          ? product.images.map((img) => ({
              file: null,
          preview: img.imageUrl,
          isMain: img.isMain,
            }))
          : [],
      });
    } else {
      setFormData({
        prodName: "",
        prodDescription: "",
        price: "",
        gender: "",
        category: "",
        stock: 0,
        popular: false,
        images: [],
      });
    }
  }, [product]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Accessibility: close modal on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = MAX_IMAGES - formData.images.length;
    const newImages = files.slice(0, remainingSlots).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isMain: formData.images.length === 0 && files.length === 1,
    }));
    if (newImages.length < files.length) {
      alert(
        `You can only upload a maximum of ${MAX_IMAGES} images. Only the first ${remainingSlots} selected images will be added.`
      );
    }
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages],
    });
  };

  const handleSetMainImage = (index) => {
    const updatedImages = formData.images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    setFormData({ ...formData, images: updatedImages });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    if (formData.images[index].isMain && updatedImages.length > 0) {
      updatedImages[0].isMain = true;
    }
    setFormData({ ...formData, images: updatedImages });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.prodName) newErrors.prodName = "Product name is required.";
    if (!formData.prodDescription)
      newErrors.prodDescription = "Description is required.";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Valid price required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.category) newErrors.category = "Category is required.";
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = "Valid stock required.";
    if (formData.images.length === 0)
      newErrors.images = "At least one image required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = new FormData();
    data.append("name", formData.prodName);
    data.append("description", formData.prodDescription);
    data.append("price", formData.price);
    data.append("gender", formData.gender);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("popular", formData.popular);
    const mainImageIndex = formData.images.findIndex((img) => img.isMain);
    data.append("mainImageIndex", mainImageIndex >= 0 ? mainImageIndex : 0);
    formData.images.forEach((img) => {
      if (img.file) {
        data.append("images", img.file);
      }
    });
    try {
      if (product) {
        await axios.patch(`${apiUrl}/products/${product.prodId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${apiUrl}/addProduct`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      refreshProducts();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const isMaxImagesReached = formData.images.length >= MAX_IMAGES;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg mx-2 sm:mx-auto bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-green-200 animate-fadeIn"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-green-700 text-2xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 text-center">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-2">
              Product Name
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none ${
                errors.prodName ? "border-red-400" : "border-gray-200"
              }`}
          value={formData.prodName}
              onChange={(e) =>
                setFormData({ ...formData, prodName: e.target.value })
              }
              autoFocus
            />
            {errors.prodName && (
              <p className="text-xs text-red-500 mt-1">{errors.prodName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-2">
              Description
            </label>
            <textarea
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none resize-none ${
                errors.prodDescription ? "border-red-400" : "border-gray-200"
              }`}
          value={formData.prodDescription}
          onChange={(e) =>
            setFormData({ ...formData, prodDescription: e.target.value })
          }
          rows={3}
        />
            {errors.prodDescription && (
              <p className="text-xs text-red-500 mt-1">
                {errors.prodDescription}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-green-900 mb-1">
                Price
              </label>
              <input
          type="number"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none ${
                  errors.price ? "border-red-400" : "border-gray-200"
                }`}
          value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                min={0}
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-green-900 mb-1">
                Stock
              </label>
              <input
                type="number"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none ${
                  errors.stock ? "border-red-400" : "border-gray-200"
                }`}
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                min={0}
              />
              {errors.stock && (
                <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Gender Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-sm font-semibold text-green-900 mb-1">
                Gender
              </label>
              <button
                type="button"
                className={`w-full px-3 py-2 border rounded-md text-left focus:ring-2 focus:ring-green-400 focus:outline-none bg-white ${
                  errors.gender ? "border-red-400" : "border-gray-200"
                }`}
                onClick={() =>
                  setDropdownOpen((d) => ({ ...d, gender: !d.gender }))
                }
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen.gender}
              >
                {formData.gender || "Select gender..."}
              </button>
              <div
                className={`absolute left-0 right-0 mt-1 bg-white border border-green-200 rounded-md shadow-lg z-20 transition-all duration-200 origin-top transform ${
                  dropdownOpen.gender
                    ? "scale-y-100 opacity-100"
                    : "scale-y-95 opacity-0 pointer-events-none"
                }`}
                style={{
                  maxHeight: dropdownOpen.gender ? 200 : 0,
                  overflow: "auto",
                }}
                role="listbox"
        >
          {genders.map((gender) => (
                  <div
                    key={gender}
                    className={`px-4 py-2 cursor-pointer hover:bg-green-100 ${
                      formData.gender === gender
                        ? "bg-green-50 font-bold text-green-700"
                        : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, gender });
                      setDropdownOpen((d) => ({ ...d, gender: false }));
                    }}
                    role="option"
                    aria-selected={formData.gender === gender}
                  >
              {gender}
                  </div>
                ))}
              </div>
              {errors.gender && (
                <p className="text-xs text-red-500 mt-1">{errors.gender}</p>
              )}
            </div>
            {/* Category Dropdown */}
            <div className="flex-1 relative">
              <label className="block text-sm font-semibold text-green-900 mb-1">
                Category
              </label>
              <button
                type="button"
                className={`w-full px-3 py-2 border rounded-md text-left focus:ring-2 focus:ring-green-400 focus:outline-none bg-white ${
                  errors.category ? "border-red-400" : "border-gray-200"
                }`}
                onClick={() =>
                  setDropdownOpen((d) => ({ ...d, category: !d.category }))
                }
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen.category}
              >
                {formData.category || "Select category..."}
              </button>
              <div
                className={`absolute left-0 right-0 mt-1 bg-white border border-green-200 rounded-md shadow-lg z-20 transition-all duration-200 origin-top transform ${
                  dropdownOpen.category
                    ? "scale-y-100 opacity-100"
                    : "scale-y-95 opacity-0 pointer-events-none"
                }`}
                style={{
                  maxHeight: dropdownOpen.category ? 200 : 0,
                  overflow: "auto",
                }}
                role="listbox"
        >
          {categories.map((category) => (
                  <div
                    key={category}
                    className={`px-4 py-2 cursor-pointer hover:bg-green-100 ${
                      formData.category === category
                        ? "bg-green-50 font-bold text-green-700"
                        : ""
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, category });
                      setDropdownOpen((d) => ({ ...d, category: false }));
                    }}
                    role="option"
                    aria-selected={formData.category === category}
                  >
              {category}
                  </div>
                ))}
              </div>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">{errors.category}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="popular"
              checked={formData.popular}
              onChange={(e) =>
                setFormData({ ...formData, popular: e.target.checked })
              }
              className="accent-green-600 w-4 h-4"
            />
            <label
              htmlFor="popular"
              className="text-sm text-green-900 font-medium select-none"
            >
              Popular
            </label>
          </div>
          {/* Image Upload and Preview */}
          <div>
            <label className="block text-sm font-semibold text-green-900 mb-1">
              Product Images
            </label>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <label
                className={`flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md cursor-pointer font-semibold shadow-sm transition-colors duration-150 ${
                  isMaxImagesReached ? "opacity-60 cursor-not-allowed" : ""
                }`}
                tabIndex={0}
              >
            <input
              type="file"
              multiple
                  accept="image/*"
                  className="hidden"
              onChange={handleImageChange}
                  disabled={isMaxImagesReached}
                />
                Choose Files
                <span className="ml-2 text-xs">
                  ({formData.images.length}/{MAX_IMAGES})
                </span>
              </label>
              {errors.images && (
                <p className="text-xs text-red-500 mt-1">{errors.images}</p>
              )}
            </div>
          {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group w-20 h-24 flex flex-col items-center"
                  >
                      <img
                        src={img.preview}
                        alt={`Preview ${index}`}
                      className={`w-20 h-20 object-cover rounded-lg border-2 ${
                        img.isMain ? "border-green-600" : "border-gray-200"
                      } shadow transition-all duration-200`}
                    />
                    <div className="flex flex-col items-center gap-1 w-full absolute left-0 top-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="mt-1 mb-1 bg-white border border-gray-300 rounded-full w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-100 shadow text-xs font-bold z-10 self-end mr-1"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(index)}
                      className={`mt-1 px-2 py-0.5 rounded text-xs font-semibold shadow w-[90%] ${
                        img.isMain
                          ? "bg-green-600 text-white"
                          : "bg-white text-green-700 border border-green-600 hover:bg-green-50"
                      }`}
                      aria-label={
                        img.isMain ? "Main image" : "Set as main image"
                      }
                      tabIndex={0}
                      style={{
                        position: "absolute",
                        bottom: "-1.5rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      {img.isMain ? "Main" : "Set Main"}
                    </button>
                    </div>
                  ))}
                </div>
          )}
          </div>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-green-600 text-green-700 font-semibold bg-white hover:bg-green-50 transition-colors duration-150"
          >
          Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition-colors duration-150 disabled:opacity-60"
            disabled={formData.images.length === 0}
        >
          Save
          </button>
        </div>
      </form>
    </div>
  );
}
