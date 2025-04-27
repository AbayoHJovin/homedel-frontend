import React, { useState } from "react";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("items");
  const [showContent, setShowContent] = useState(true);
  const [filter, setFilter] = useState({
    items: "> 0",
    status: "all",
    total: "> 0",
    method: "all",
    date: "",
  });

  const handleTabSwitch = (tab) => {
    setShowContent(false);
    setTimeout(() => {
      setActiveTab(tab);
      setShowContent(true);
    }, 300); // Delay for transition effect
  };

  const handleFilterChange = (tab, value) => {
    setFilter({ ...filter, [tab]: value });
  };

  const getContent = () => {
    switch (activeTab) {
      case "items":
        return `Showing items with quantity ${filter.items}`;
      case "status":
        return `Showing status: ${filter.status}`;
      case "total":
        return `Showing transactions with total amount ${filter.total}`;
      case "method":
        return `Transaction Method: ${filter.method}`;
      case "date":
        return `Transactions for date: ${filter.date || "No date selected"}`;
      case "all":
        return (
          <div>
            <p>Number of items: {filter.items}</p>
            <p>Status: {filter.status}</p>
            <p>Total: {filter.total}</p>
            <p>Transaction Method: {filter.method}</p>
            <p>Date: {filter.date || "No date selected"}</p>
          </div>
        );
      default:
        return "Select a tab to view content";
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Tab buttons */}
      <div className="flex space-x-2">
        {["items", "status", "total", "method", "date", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabSwitch(tab)}
            className={`relative px-4 py-2 rounded-md transition-all duration-200 ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "items" && "Items"}
            {tab === "status" && "Status"}
            {tab === "total" && "Total"}
            {tab === "method" && "Method"}
            {tab === "date" && "Date"}
            {tab === "all" && "All"}

            {/* Hover dropdowns */}
            {(tab === "items" ||
              tab === "status" ||
              tab === "total" ||
              tab === "method") &&
              activeTab === tab && (
                <div className="absolute left-0 mt-2 w-40 bg-white border rounded-md shadow-lg p-2">
                  {tab === "items" && (
                    <input
                      type="text"
                      placeholder="e.g., >100"
                      className="w-full p-1 border rounded"
                      value={filter.items}
                      onChange={(e) =>
                        handleFilterChange("items", e.target.value)
                      }
                    />
                  )}
                  {tab === "status" && (
                    <select
                      className="w-full p-1 border rounded"
                      value={filter.status}
                      onChange={(e) =>
                        handleFilterChange("status", e.target.value)
                      }
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                  {tab === "total" && (
                    <input
                      type="text"
                      placeholder="e.g., >100"
                      className="w-full p-1 border rounded"
                      value={filter.total}
                      onChange={(e) =>
                        handleFilterChange("total", e.target.value)
                      }
                    />
                  )}
                  {tab === "method" && (
                    <select
                      className="w-full p-1 border rounded"
                      value={filter.method}
                      onChange={(e) =>
                        handleFilterChange("method", e.target.value)
                      }
                    >
                      <option value="all">All</option>
                      <option value="MTN">MTN</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  )}
                </div>
              )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className={`mt-4 p-4 border rounded-md shadow-md transition-opacity duration-300 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        {activeTab === "date" ? (
          <input
            type="date"
            className="p-2 border rounded w-full"
            value={filter.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
        ) : null}
        {getContent()}
      </div>
    </div>
  );
};

export default Tabs;
