import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { ExportButton, DetailButton } from "../../assets/icons/index";
import { API_URL } from "../../config/api";
import axios from "axios";
import Cookies from "js-cookie";
import Receipt from "../content/receipt";

const SalesReportable = (role) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    orderType: "",
  });

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }) +
          " " +
          new Date(dateString).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
      : "N/A";
  };

  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = (id) => {
    setShowPopup(id);
  };

  const handleClosePopup = () => {
    setShowPopup();
  };

  useEffect(() => {
    const fetchOrderItems = async () => {
      setIsLoading(true);
      try {
        let response;

        if (role.role === "cashier") {
          response = await axios.get(`${API_URL}/orders/cashier`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
        } else {
          response = await axios.get(`${API_URL}/orders/admin`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          });
        }
        const datas = response;
        const mappedData = datas.data.map((item) => ({
          id: item.id,
          no_order: item.no_order || "N/A",
          createdAt: item.createdAt,
          order_type: item.order_type || "N/A",
          // category: item.category || "N/A",
          custome_name: item.customer_name || "N/A",
          detail: item.detail || "N/A",
        }));

        setAllData(mappedData);
        setFilteredData(mappedData);
      } catch {
        console.error("Error fetching order items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItems();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    if (!filters.startDate && !filters.endDate && !filters.orderType) {
      setFilteredData(allData);
      setCurrentPage(1);
      return;
    }

    // Filter data berdasarkan input filter
    const newFilteredData = allData.filter((item) => {
      const orderDate = new Date(item.createdAt);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const matchesDate = (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
      const matchesOrderType = !filters.orderType || item.order_type.toLowerCase().includes(filters.orderType.toLowerCase());
      return matchesDate && matchesOrderType;
    });

    setFilteredData(newFilteredData);
    setCurrentPage(1);
  };
  const handleExport = () => {
    const csvData = [["No Order", "Order Date", "Order Type", "Customer Name", "Detail"], ...filteredData.map((item) => [item.no_order, item.createdAt, item.order_type, item.category, item.custome_name, item.detail])]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "exported_data.csv");
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="bg-white mt-5 rounded-lg p-5">
      <div className="w-full flex flex-wrap gap-4 items-end pb-5">
        <div className="flex flex-col flex-1 min-w-[300px]">
          <label className="text-base font-medium text-gray-500">Start</label>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-lg" />
        </div>
        <div className="flex flex-col flex-1 min-w-[300px]">
          <label className="text-base font-medium text-gray-500">Finish</label>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="h-[48px] border border-gray-300 rounded-lg" />
        </div>
        <div className="flex flex-col flex-1 min-w-[200px]">
          <label className="text-base font-medium text-gray-500">Category</label>
          {/* <input type="text" name="category" value={filters.category} onChange={handleFilterChange} className="h-[48px] border border-gray-300 rounded-lg" /> */}
          <select value={filters.orderType} name="category" onChange={handleFilterChange} className="h-[48px] border border-gray-300 rounded-lg">
            <option value="" disabled>
              Select Category
            </option>
            <option value="Food">Food</option>
            <option value="Beverage">Beverage</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>
        <div className="flex flex-col flex-1 min-w-[200px]">
          <label className="text-base font-medium text-gray-500">Order Type</label>
          <select value={filters.orderType} name="orderType" onChange={handleFilterChange} className="h-[48px] border border-gray-300 rounded-lg">
            <option value="" disabled>
              Select order type
            </option>
            <option value="Dine In">Dine In</option>
            <option value="Take Away">Take Away</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSearch} className="text-base h-[48px] px-10 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Search
          </button>

          <span onClick={handleExport}>
            <ExportButton />
          </span>
        </div>
      </div>

      <table className="w-full bg-white border border-gray-100 p-5 overflow-x-auto overflow-y-auto max-h-[400px]">
        <thead>
          <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
            <th className="py-3 px-6 text-left">No Order</th>
            <th className="py-3 px-6 text-left">Order Date</th>
            <th className="py-3 px-6 text-left">Order Type</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Customer Name</th>
            <th className="py-3 px-6 text-left">Detail</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="py-3 px-6 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            currentRows.map((item, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{item.no_order}</td>
                <td className="py-3 px-6 text-left">{formatDate(item.createdAt)}</td>
                <td className="py-3 px-6 text-left">{item.order_type}</td>
                <td className="py-3 px-6 text-left"></td>
                <td className="py-3 px-6 text-left">{item.custome_name}</td>
                <td className="py-3 px-6 text-left">
                  <span onClick={() => handleShowPopup(item.id)}>
                    <DetailButton></DetailButton>
                  </span>
                  <div className="">{showPopup === item.id && <Receipt data={item.id} status="Detail" handleClose={handleClosePopup} />}</div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        {/* Entries per page */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Show</label>
          <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="text-[12px] border border-gray-300 rounded-lg">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <label className="text-sm text-gray-700">Entries</label>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-4">
          <button onClick={handlePrevious} disabled={currentPage === 1} className="p-2 bg-gray-300 rounded-lg disabled:opacity-50">
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages} className="p-2 bg-gray-300 rounded-lg disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesReportable;
