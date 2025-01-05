import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../config/api";

const MyBarChartWithFilters = () => {
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [category, setCategory] = useState("All");
  const [data, setData] = useState([]);
  const [chartWidth, setChartWidth] = useState(0);
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const updateChartWidth = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.offsetWidth);
      }
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);

    return () => window.removeEventListener("resize", updateChartWidth);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading saat data mulai diambil
      setError(null);

      try {
        const response = await axios.get(`${API_URL}/orders/chart`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        const result = response.data;

        // Transform data sesuai kebutuhan chart
        const transformedData = result.data.map((item) => ({
          day: item.day,
          Food: item.Food || 0,
          Beverage: item.Beverage || 0,
          Dessert: item.Dessert || 0,
        }));

        setData(transformedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Set loading selesai setelah data berhasil diambil
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan kategori
  const filteredData = data.map((item) => {
    return category === "All" ? item : { day: item.day, [category]: item[category] };
  });

  if (loading) {
    return (
      <div className="p-6 w-full bg-white" ref={chartContainerRef}>
        <p className="text-center text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 w-full bg-white" ref={chartContainerRef}>
        <p className="text-center text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 w-full bg-white" ref={chartContainerRef}>
      <div className="p-6 w-full bg-white" ref={chartContainerRef}>
        <div className="flex flex-wrap justify-between items-center mb-6">
          {" "}
          {/* Tambahkan flex-wrap */}
          <h2 className="text-xl font-bold mb-4 md:mb-0">Total Omzet</h2> {/* Tambahkan margin-bottom untuk layout responsif */}
          <div className="flex flex-wrap items-center gap-4">
            {" "}
            {/* Tambahkan flex-wrap */}
            <input title="Start date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-gray-300 rounded p-2" />
            <input placeholder="Finish date" type="date" value={finishDate} onChange={(e) => setFinishDate(e.target.value)} className="border border-gray-300 rounded p-2" />
            <select title="Select Category" placeholder="Select Category" value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-300 rounded p-2">
              <option value="All">Select Category</option>
              <option value="Food">Food</option>
              <option value="Beverage">Beverage</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
        </div>
      </div>

      <BarChart width={chartWidth} height={400} data={filteredData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }} barSize={30}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        {(category === "All" || category === "Food") && <Bar dataKey="Food" fill="#003F88" />}
        {(category === "All" || category === "Beverage") && <Bar dataKey="Beverage" fill="#4A90E2" />}
        {(category === "All" || category === "Dessert") && <Bar dataKey="Dessert" fill="#B3D4FC" />}
      </BarChart>
    </div>
  );
};

export default MyBarChartWithFilters;
