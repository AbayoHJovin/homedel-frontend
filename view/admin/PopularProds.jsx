/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { CgAdd, CgMathMinus } from "react-icons/cg";
import Loader from "../src/components/loader";
import ProductModal from "./ProductModal";
import EmptyState from "./EmptyState";
import { apiUrl } from "../src/lib/apis";

// Utility to truncate text
function truncateText(text, maxLength = 80) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const categories = ["shoes", "shirts", "pants", "watches", "hats"];
  const genders = ["Male", "Female", "Unisex"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/products`);
      const popularProducts = response.data.filter(
        (item) => item.popular === true
      );
      setProducts(response.data);
      setFilteredProducts(popularProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const searchTermLower = e.target.value.toLowerCase();
    setSearchTerm(e.target.value);
    setFilteredProducts(
      products
        .filter((product) => product.popular)
        .filter(
          (product) =>
            product.prodName.toLowerCase().includes(searchTermLower) ||
            product.prodDescription.toLowerCase().includes(searchTermLower)
        )
    );
  };

  const handleDelete = async (prodId) => {
    try {
      await axios.delete(`${apiUrl}/products/${prodId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const togglePopularity = async (prodId, popularity) => {
    try {
      await fetch(`${apiUrl}/makeAPopularProduct?prodId=${prodId}`, {
        method: "PATCH",
        headers: {
          popularity: popularity ? "true" : "false",
        },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling popularity:", error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Show More/Show Less for description
  const handleToggleDescription = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="p-2 sm:p-5 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-6 text-center tracking-tight">
          Popular Products
        </h1>
        <div className="flex flex-col items-center justify-center gap-3 mb-6 w-full">
          <div className="flex flex-row w-full sm:w-[60%] max-w-xl gap-2 bg-white rounded-lg shadow p-2">
            <input
              type="text"
              placeholder="Search popular products"
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-50"
            />
          </div>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : filteredProducts.length === 0 ? (
        <EmptyState message="No popular products available" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-lg text-gray-800">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm tracking-wider">
                <th className="p-3 sm:p-4">Image</th>
                <th className="p-3 sm:p-4">Name</th>
                <th className="p-3 sm:p-4">Description</th>
                <th className="p-3 sm:p-4">Category</th>
                <th className="p-3 sm:p-4">Stock</th>
                <th className="p-3 sm:p-4">Sold</th>
                <th className="p-3 sm:p-4">Price</th>
                <th className="p-3 sm:p-4">Gender</th>
                <th className="p-3 sm:p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const mainImage =
                  product.images.find((img) => img.isMain)?.imageUrl ||
                  product.images[0]?.imageUrl ||
                  "https://via.placeholder.com/100";
                const isExpanded = expandedRows.includes(index);
                return (
                  <tr
                    key={index}
                    className={`transition-colors duration-150 border-b border-gray-200 hover:bg-green-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-3 sm:p-4 flex justify-center">
                      <img
                        src={mainImage}
                        alt={product.prodName}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow"
                      />
                    </td>
                    <td className="p-3 sm:p-4 font-bold text-green-800 text-sm sm:text-base">
                      {product.prodName}
                    </td>
                    <td className="p-3 sm:p-4 max-w-xs text-xs sm:text-sm">
                      {isExpanded ? (
                        <>
                          {product.prodDescription}
                          {product.prodDescription.length > 80 && (
                            <button
                              className="ml-2 text-green-600 hover:underline text-xs font-semibold"
                              onClick={() => handleToggleDescription(index)}
                            >
                              Show Less
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {truncateText(product.prodDescription, 80)}
                          {product.prodDescription.length > 80 && (
                            <button
                              className="ml-2 text-green-600 hover:underline text-xs font-semibold"
                              onClick={() => handleToggleDescription(index)}
                            >
                              Show More
                            </button>
                          )}
                        </>
                      )}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      {product.category}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm font-semibold text-blue-700">
                      {product.stock}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      {product.sold || 0}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm font-bold text-yellow-700">
                      RWF {product.price}
                    </td>
                    <td className="p-3 sm:p-4 text-xs sm:text-sm">
                      {product.gender}
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() =>
                            togglePopularity(product.prodId, false)
                          }
                        >
                          <CgMathMinus
                            className="text-yellow-500 hover:text-yellow-700 text-xl"
                            title="Remove from popular products"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <ProductModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          refreshProducts={fetchProducts}
          categories={categories}
          genders={genders}
        />
      )}
    </div>
  );
}
