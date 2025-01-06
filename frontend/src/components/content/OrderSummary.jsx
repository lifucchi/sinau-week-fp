import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { OrdersIcon, OmzetIcon, MenuOrderIcon, FoodsIcon, BeveragesIcon, DessertsIcon, MoreIcon } from "../../assets/icons/index";
import { API_URL } from "../../config/api";
import PopUp from "../popup/popup";

const OrderSummary = (role) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalOmzet: 0,
    allMenuOrders: 0,
    foods: 0,
    beverages: 0,
    desserts: 0,
  });
  const [showPopupStat, setShowPopupStat] = useState(false);
  const [statsCategory, setstatsCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState([]);

  const handleShowPopupStat = (category) => {
    const filteredData = statsCategory.filter((item) => {
      if (category === "Foods") return item.category === "Food";
      if (category === "Beverages") return item.category === "Beverage";
      if (category === "Desserts") return item.category === "Dessert";
      return false;
    });
    setSelectedCategory(category);
    setSelectedCategoryData(filteredData);
    setShowPopupStat(true);
  };

  const handleClosePopupStat = () => {
    setShowPopupStat(false);
  };

  useEffect(() => {}, [showPopupStat, statsCategory]);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = Cookies.get("token");
        let response;
        // console.log(role.role);

        if (role.role == "cashier") {
          response = await axios.get(`${API_URL}/orders/cashier_stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          response = await axios.get(`${API_URL}/orders/all_stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        const data = response;
        const dataCategory = data.data.categoryStats || [];

        setstatsCategory(dataCategory);
        const FoodTotalSold = dataCategory.filter((item) => item.category === "Food").reduce((total, item) => total + parseInt(item.total_sold || 0, 10), 0);

        const BeverageTotalSold = dataCategory.filter((item) => item.category === "Beverage").reduce((total, item) => total + parseInt(item.total_sold || 0, 10), 0);

        const DessertTotalSold = dataCategory.filter((item) => item.category === "Dessert").reduce((total, item) => total + parseInt(item.total_sold || 0, 10), 0);
        setStats({
          totalOrders: data.data.statistics.total_orders,
          totalOmzet: Number(data.data.statistics.omzet).toLocaleString("id-ID"),
          allMenuOrders: data.data.statistics.total_menu_ordered,
          foods: FoodTotalSold,
          beverages: BeverageTotalSold,
          desserts: DessertTotalSold,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid lg:grid-cols-[40%_60%] gap-5 mt-5 w-full mx-auto sm:grid-cols-1 md:grid-cols-1">
      {/* Total Orders */}
      <div className="grid lg:grid-cols-2 gap-5 lg:mr-0 sm:mr-5 md:mr-5 sm:grid-cols-1 md:grid-cols-1 ">
        <div className="flex flex-col pl-5 pt-3 pb-1 h-[92px] bg-white border border-[#EBEBEB] rounded-[10px] col-span=1">
          <p className="text-left text-xs">Total Orders</p>
          <div className="flex items-center gap-2 mt-[5px]">
            <OrdersIcon />
            <span className="text-2xl font-medium">{stats.totalOrders}</span>
          </div>
        </div>

        {/* Total Omzet */}
        <div className="flex flex-col pl-5 pt-3 pb-1 h-[92px] bg-white border border-[#EBEBEB] rounded-[10px] col-span-1  ">
          <p className="text-left text-xs">Total Omzet</p>
          <div className="flex items-center gap-2 mt-[5px]">
            <OmzetIcon />
            <span className="text-2xl font-medium">Rp {stats.totalOmzet}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5 mr-5 sm:grid-cols-1 md:grid-cols-1">
        {/* All Menu Orders */}
        <div className="flex flex-col pl-5 pt-3 pb-1 h-[92px] bg-white border border-[#EBEBEB] rounded-[10px] col-span-1 relative">
          <p className="text-left text-xs">All Menu Orders</p>
          <div className="flex items-center gap-2 mt-[5px]">
            <MenuOrderIcon />
            <span className="text-2xl font-medium">{stats.allMenuOrders}</span>
          </div>
        </div>
        {/* Foods */}
        <div className="flex flex-col pl-5 pt-3 pb-1 h-[92px] bg-white border border-[#EBEBEB] rounded-[10px] col-span-1 relative">
          <p className="text-left text-xs">Foods</p>
          <div className="flex items-center gap-2 mt-[5px] text-blue-500">
            <FoodsIcon className="stroke-current " />
            <span className="text-2xl font-medium text-black">{stats.foods}</span>
          </div>
          <span onClick={() => handleShowPopupStat("Foods")} className="absolute bottom-0 right-0 p-[10px]">
            <MoreIcon />
          </span>
        </div>
        {/* Beverages */}
        <div className="flex flex-col pl-5 pt-3 pb-1 h-[92px] bg-white border border-[#EBEBEB] rounded-[10px] col-span-1 relative">
          <p className="text-left text-xs">Beverages</p>
          <div className="flex items-center gap-2 mt-[5px] text-blue-500">
            <BeveragesIcon className="stroke-current " />
            <span className="text-2xl font-medium text-black">{stats.beverages}</span>
          </div>
          <span onClick={() => handleShowPopupStat("Beverages")} className="absolute bottom-0 right-0 p-[10px]">
            <MoreIcon />
          </span>
        </div>
        {/* Desserts */}
        <div className="flex flex-col pl-5 pt-3 pb-1 h-[92px] bg-white border border-[#EBEBEB] rounded-[10px] col-span-1 relative">
          <p className="text-left text-xs">Desserts</p>
          <div className="flex items-center gap-2 mt-[5px] text-blue-500">
            <DessertsIcon className="stroke-current " />
            <span className="text-2xl font-medium text-black">{stats.desserts}</span>
          </div>
          <span onClick={() => handleShowPopupStat("Desserts")} className="absolute bottom-0 right-0 p-[10px]">
            <MoreIcon />
          </span>
        </div>
      </div>

      {showPopupStat && <PopUp handleClose={handleClosePopupStat} title={selectedCategory} data={selectedCategoryData}></PopUp>}
    </div>
  );
};

export default OrderSummary;
