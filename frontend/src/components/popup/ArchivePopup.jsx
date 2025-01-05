import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "../../assets/icons/index";
import { API_URL } from "../../config/api";
import axios from "axios";
import Cookies from "js-cookie";

const ArchivePopup = ({ isOpen, onClose }) => {
  const [originalOrders, setOriginalOrders] = useState([]); // Data asli dari API
  const [filteredOrders, setFilteredOrders] = useState([]); // Data yang difilter
  const [search, setSearch] = useState(""); // Kata kunci pencarian
  const [orderType, setOrderType] = useState(""); // Filter tipe order
  const [loading, setLoading] = useState(true); // Status loading
  const [error, setError] = useState(""); // Status error

  // Mengambil data dari API saat komponen dimuat pertama kali
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_URL}/orders/cashier_archive`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        // Format data sesuai kebutuhan
        const formattedData = response.data.map((order) => ({
          no_order: order.no_order,
          type: order.order_type,
          name: order.customer_name,
          table: order.no_table || "N/A",
          price: `Rp ${order.total.toLocaleString()}`,
          date: new Date(order.createdAt).toLocaleString(),
        }));

        // Set data asli dan data yang ditampilkan
        setOriginalOrders(formattedData);
        setFilteredOrders(formattedData);
      } catch (error) {
        setError("Failed to fetch data. Please try again.");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fungsi pencarian dan filter
  const handleSearch = () => {
    const filtered = originalOrders.filter(
      (order) =>
        (order.no_order.toLowerCase().includes(search.toLowerCase()) || order.name.toLowerCase().includes(search.toLowerCase()) || order.table.toLowerCase().includes(search.toLowerCase())) && (orderType ? order.type === orderType : true)
    );
    setFilteredOrders(filtered);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-2/5 h-3/5 overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl ">Order Archive</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="bg-[#F7F7F7]">
          <div className="p-4 flex gap-4">
            <div className="relative w-[500px] h-[42px] bg-white border border-[#EBEBEB] rounded-[10px]">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Enter the keyword here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full px-10 pl-10 outline-none rounded-lg border border-gray-300 text-gray-700 placeholder-gray-500"
              />
            </div>
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="border p-2 rounded">
              <option value="">Select type order</option>
              <option value="Dine-in">Dine In</option>
              <option value="Take Away">Take Away</option>
            </select>
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
              Search
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && <div className="p-4 text-center text-gray-500">Loading...</div>}

          {/* Error Message */}
          {error && <div className="p-4 text-center text-red-500">{error}</div>}

          {/* Data Orders */}
          {!loading && !error && (
            <div className="m-2.5 gap-4 bg-white rounded-lg">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <div key={index} className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-4">
                        <p className="text-gray-500">No Order {order.no_order}</p>
                        <p>{order.type}</p>
                        <p>{order.name}</p>
                        {order.type !== "Take Away" && <p>{order.table}</p>}
                      </div>
                      <div className="text-gray-500">{order.date}</div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="font-bold">{order.price}</p>
                      <ArrowLeft></ArrowLeft>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No orders found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivePopup;
