import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { CgAdd, CgMathMinus } from "react-icons/cg";
import Loader from "../src/components/loader";
import ProductModal from "./ProductModal";
import { apiUrl } from "../src/lib/apis";

// Utility to truncate text
function truncateText(text, maxLength = 80) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const NOT_FOUND = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <img
      src="/public/noData.png"
      alt="Not found"
      className="w-32 h-32 mb-4 opacity-80"
    />
    <h2 className="text-lg font-semibold text-gray-700">No products found</h2>
    <p className="text-gray-500 text-sm mt-2">
      Try adjusting your filters or search.
    </p>
  </div>
);

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterPrice, setFilterPrice] = useState(["", ""]);
  const [filterSold, setFilterSold] = useState(["", ""]);
  const [filterStock, setFilterStock] = useState(["", ""]);
  const [sortBy, setSortBy] = useState("");

  const categories = ["shoes", "shirts", "pants", "watches", "hats"];
  const genders = ["Male", "Female", "Unisex"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchTermLower = e.target.value.toLowerCase();
    setFilteredProducts(
      products.filter(
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
      await axios.patch(
        `${apiUrl}/makeAPopularProduct?prodId=${prodId}`,
        null,
        {
          headers: { popularity: popularity ? "true" : "false" },
        }
      );
      fetchProducts();
    } catch (error) {
      console.error("Error toggling popularity:", error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleToggleDescription = (index) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.prodName.toLowerCase().includes(searchTermLower) ||
          product.prodDescription.toLowerCase().includes(searchTermLower)
      );
    }
    if (filterCategory)
      filtered = filtered.filter((p) => p.category === filterCategory);
    if (filterGender)
      filtered = filtered.filter((p) => p.gender === filterGender);
    if (filterPrice[0] !== "")
      filtered = filtered.filter(
        (p) => Number(p.price) >= Number(filterPrice[0])
      );
    if (filterPrice[1] !== "")
      filtered = filtered.filter(
        (p) => Number(p.price) <= Number(filterPrice[1])
      );
    if (filterSold[0] !== "")
      filtered = filtered.filter(
        (p) => Number(p.sold || 0) >= Number(filterSold[0])
      );
    if (filterSold[1] !== "")
      filtered = filtered.filter(
        (p) => Number(p.sold || 0) <= Number(filterSold[1])
      );
    if (filterStock[0] !== "")
      filtered = filtered.filter(
        (p) => Number(p.stock) >= Number(filterStock[0])
      );
    if (filterStock[1] !== "")
      filtered = filtered.filter(
        (p) => Number(p.stock) <= Number(filterStock[1])
      );
    if (sortBy === "name-asc")
      filtered = filtered.sort((a, b) => a.prodName.localeCompare(b.prodName));
    if (sortBy === "name-desc")
      filtered = filtered.sort((a, b) => b.prodName.localeCompare(a.prodName));
    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    filterCategory,
    filterGender,
    filterPrice,
    filterSold,
    filterStock,
    sortBy,
  ]);

  return (
    <div className="p-2 sm:p-5 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900 mb-6 text-center tracking-tight">
          Product Management
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6 w-full">
          <div className="flex flex-row w-full sm:w-[60%] max-w-xl gap-2 bg-white rounded-lg shadow p-2">
            <input
              type="text"
              placeholder="Search a product"
              value={searchTerm}
              onChange={handleSearch}
              className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-50"
            />
            <button
              style={{ backgroundColor: "#0e8c2b" }}
              onClick={() => {
                setSelectedProduct(null); // Reset for new product
                setShowModal(true);
              }}
              className="ml-2 px-4 py-2 rounded-md font-semibold text-white bg-green-700 hover:bg-green-800 shadow-sm text-sm whitespace-nowrap"
            >
              Add Product
            </button>
          </div>
        </div>
        {/* Filters Bar */}
        <div className="flex flex-wrap gap-3 justify-center items-center mb-6 bg-white rounded-lg shadow p-4 w-full max-w-5xl mx-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded border border-gray-200 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-3 py-2 rounded border border-gray-200 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Genders</option>
            {genders.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Price:</span>
            <input
              type="number"
              min="0"
              value={filterPrice[0]}
              onChange={(e) => setFilterPrice([e.target.value, filterPrice[1]])}
              placeholder="Min"
              className="w-16 px-2 py-1 rounded border border-gray-200 text-xs focus:ring-2 focus:ring-green-500"
            />
            <span className="mx-1 text-xs">-</span>
            <input
              type="number"
              min="0"
              value={filterPrice[1]}
              onChange={(e) => setFilterPrice([filterPrice[0], e.target.value])}
              placeholder="Max"
              className="w-16 px-2 py-1 rounded border border-gray-200 text-xs focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Sold:</span>
            <input
              type="number"
              min="0"
              value={filterSold[0]}
              onChange={(e) => setFilterSold([e.target.value, filterSold[1]])}
              placeholder="Min"
              className="w-16 px-2 py-1 rounded border border-gray-200 text-xs focus:ring-2 focus:ring-green-500"
            />
            <span className="mx-1 text-xs">-</span>
            <input
              type="number"
              min="0"
              value={filterSold[1]}
              onChange={(e) => setFilterSold([filterSold[0], e.target.value])}
              placeholder="Max"
              className="w-16 px-2 py-1 rounded border border-gray-200 text-xs focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Stock:</span>
            <input
              type="number"
              min="0"
              value={filterStock[0]}
              onChange={(e) => setFilterStock([e.target.value, filterStock[1]])}
              placeholder="Min"
              className="w-16 px-2 py-1 rounded border border-gray-200 text-xs focus:ring-2 focus:ring-green-500"
            />
            <span className="mx-1 text-xs">-</span>
            <input
              type="number"
              min="0"
              value={filterStock[1]}
              onChange={(e) => setFilterStock([filterStock[0], e.target.value])}
              placeholder="Max"
              className="w-16 px-2 py-1 rounded border border-gray-200 text-xs focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded border border-gray-200 text-sm focus:ring-2 focus:ring-green-500"
          >
            <option value="">Sort by</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
          <button
            className="ml-2 px-3 py-2 rounded bg-gray-100 text-gray-600 border border-gray-200 text-xs hover:bg-gray-200"
            onClick={(e) => {
              e.preventDefault();
              setFilterCategory("");
              setFilterGender("");
              setFilterPrice(["", ""]);
              setFilterSold(["", ""]);
              setFilterStock(["", ""]);
              setSortBy("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filteredProducts.length === 0 ? (
        <NOT_FOUND />
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
                      <div className="flex space-x-3 items-center justify-center">
                        <button onClick={() => handleEdit(product)}>
                          <FaEdit className="text-blue-500 hover:text-blue-700" />
                        </button>
                        <button onClick={() => handleDelete(product.prodId)}>
                          <FaTrashAlt className="text-red-500 hover:text-red-700" />
                        </button>
                        <button
                          onClick={() =>
                            togglePopularity(product.prodId, !product.popular)
                          }
                        >
                          {product.popular ? (
                            <CgMathMinus
                              className="text-yellow-500 hover:text-yellow-700"
                              title="Remove from popular products"
                            />
                          ) : (
                            <CgAdd
                              className="text-green-500 hover:text-green-700"
                              title="Add to popular products"
                            />
                          )}
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
