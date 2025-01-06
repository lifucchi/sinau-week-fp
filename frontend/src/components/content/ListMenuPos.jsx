import React, { useState, useEffect } from "react";
import axios from "axios";
import { FoodsIcon, BeveragesIcon, DessertsIcon } from "../../assets/icons/index";
import MenuCardList from "../cards/MenuCardList";
import { API_URL } from "../../config/api";
import Cookies from "js-cookie";
import OrderForm from "../forms/OrderForm";
import { useNavigate, useLocation } from "react-router-dom";

const ListMenuPos = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("All Menu");
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);
  const [customer, setCustomer] = useState({
    customer_name: "",
    order_type: "",
    no_table: "",
  });

  const location = useLocation();
  const archivedId = location.state;

  const handleMenuClick = (menu) => {
    setSelectedMenus((prevMenus) => {
      const existingMenu = prevMenus.find((item) => item.id === menu.id);
      if (existingMenu) {
        return prevMenus.map((item) => (item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevMenus, { ...menu, quantity: 1 }];
    });
  };

  const handleDeleteMenu = (id) => {
    setSelectedMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== id));
  };

  const handleUpdateNote = (menuId, note) => {
    setSelectedMenus((prevMenus) => prevMenus.map((menu) => (menu.id === menuId ? { ...menu, note } : menu)));
  };

  const handleFormSubmit = async () => {
    await fetchOrderNumber();

    setSelectedMenus([]);
  };
  const updateMenuQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedMenus((prevMenus) => prevMenus.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  };

  const fetchOrderNumber = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/next_order_number`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setOrderNumber(response.data.orderNumber);
    } catch (error) {
      console.error("Failed to fetch order number:", error);
      setOrderNumber(null);
    }
  };

  const fetchOrderById = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      const orderDetails = response.data.ListOrderDetails.map((item) => ({
        id: item.Menu.id,
        name: item.Menu.name,
        price: item.Menu.price,
        quantity: item.order_quantity,
        photo: item.Menu.photo,
      }));

      setCustomer({
        customer_name: response.data.customer_name,
        order_type: response.data.order_type,
        no_table: response.data.no_table,
      });

      setOrderNumber(response.data.no_order);
      setSelectedMenus(orderDetails);
    } catch (error) {
      console.error("Failed to fetch order by ID:", error);
    }
  };

  useEffect(() => {
    if (archivedId) {
      fetchOrderById(archivedId);

      navigate("/pos", { state: null });
    }
  }, [archivedId]);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/menus`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setMenus(response.data);
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
    fetchOrderNumber();
  }, []);

  useEffect(() => {}, [menus, selectedMenus, orderNumber]);

  return (
    <div className="grid grid-cols-3 gap-5 mt-5 w-full">
      {/* Total Orders */}
      <div className="col-span-2 h-[64px]">
        <div className="flex flex-row justify-between items-center h-full m-0 rounded-[10px] gap-5">
          <div className={`flex flex-col w-full h-full rounded-[10px] border ${activeTab === "All Menu" ? "bg-blue-500 border-blue-500" : "border-gray-300"}`} onClick={() => setActiveTab("All Menu")}>
            <p className={`flex justify-center items-center text-xl font-medium h-full ${activeTab === "All Menu" ? "text-white" : "text-gray-400"}`}>All Menu</p>
          </div>

          {/* Tab untuk Foods, Beverages, dan Desserts */}
          {["Foods", "Beverages", "Desserts"].map((tab) => (
            <div key={tab} className={`flex flex-col w-full h-full rounded-[10px] border ${activeTab === tab ? "bg-blue-500 border-blue-500" : "border-gray-300"}`} onClick={() => setActiveTab(tab)}>
              <p className={`flex justify-center items-center text-xl font-medium h-full ${activeTab === tab ? "text-white" : "text-gray-400"}`}>
                {tab === "Foods" && <FoodsIcon className="stroke-current" />}
                {tab === "Beverages" && <BeveragesIcon className="stroke-current" />}
                {tab === "Desserts" && <DessertsIcon className="stroke-current" />}
                {tab}
              </p>
            </div>
          ))}
        </div>

        {/* Konten lainnya di bawah */}
        <div className="mt-5 gap-5">
          <MenuCardList activeTab={activeTab} menus={menus} loading={loading} onMenuClick={handleMenuClick} />
        </div>
      </div>

      <div className="col-span-1 gap-5 h-[60vh] flex flex-col">
        <div className="flex flex-col flex-1 bg-white border border-[#EBEBEB] rounded-[10px] relative">
          <div className="p-5 pt-0 pb-0 mb-0">
            <div className="flex flex-col gap-4">
              <OrderForm onEditNoteMenu={handleUpdateNote} customer={customer} orderNumber={orderNumber} selectedMenus={selectedMenus} updateMenuQuantity={updateMenuQuantity} onSubmit={handleFormSubmit} onDeleteMenu={handleDeleteMenu} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListMenuPos;
