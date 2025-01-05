import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "../../assets/icons/index";

const PopUp = ({ handleClose, title, data }) => {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // State untuk kata kunci pencarian
  const [filteredData, setFilteredData] = useState([]); // State untuk data yang difilter

  useEffect(() => {
    if (data) {
      setFilteredData(data); // Set data awal yang ditampilkan
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [data]);

  // Handler untuk perubahan input pencarian
  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);

    // Filter data berdasarkan kata kunci
    const filtered = data.filter(
      (item) => item.name.toLowerCase().includes(keyword) // Sesuaikan dengan properti yang ingin dicari
    );
    setFilteredData(filtered);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white w-[90%] max-w-[610px] p-10 pl-5 pt-0 rounded-[20px] border border-gray-300 shadow-lg">
        {/* Tombol Exit */}
        <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={handleClose}>
          ✕
        </button>

        {/* Konten */}
        <div className="flex flex-col items-left justify-center h-full">
          <h2 className="text-4xl font-semibold text-gray-800 mb-5 mt-5">{title}</h2>
          {isLoading ? (
            <div>LOADING</div>
          ) : (
            <div className="flex flex-col w-full h-full">
              {/* Input Keyword */}
              <div className="relative mb-4 w-full">
                <input
                  type="text"
                  placeholder="Enter the keyword here..."
                  className="w-full pl-10 py-2 px-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={searchKeyword}
                  onChange={handleSearch} // Tambahkan handler untuk input pencarian
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-y-auto max-h-[400px] border border-gray-200 rounded-md">
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Menu Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 text-sm">{item.name}</td>
                        <td className="px-4 py-2 text-sm">{item.total_sold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
