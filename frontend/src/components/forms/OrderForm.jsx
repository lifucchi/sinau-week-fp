import React, { useState, useEffect } from "react";
import MenuCardPosItem from "../cards/MenuCardPosItem";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ArchiveButton } from "../../assets/icons/index";
import { API_URL } from "../../config/api";

const OrderForm = ({ customer, onSubmit, selectedMenus, updateMenuQuantity, orderNumber, onDeleteMenu }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedNominal, setSelectedNominal] = useState(0);
  const [activeButton, setActiveButton] = useState("Dine In");

  const [formData, setFormData] = useState({
    id_user: null,
    customer_name: customer.customer_name || "",
    no_order: orderNumber,
    no_table: customer.no_table || "",
    order_type: customer.order_type || activeButton,
    subtotal: null,
    tax: null,
    total: null,
    status: null,
    payment_nominal: 0,
    orderItems: [],
  });

  const [errors, setErrors] = useState({});
  const selectedMenusArray = Array.isArray(selectedMenus) ? selectedMenus : [selectedMenus];

  const handlePayClick = (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill out all required fields.");
      return;
    }
    setIsConfirming(true);
  };

  const handleButtonClick = (value) => {
    setActiveButton(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = "Customer name is required.";
    if (activeButton === "Dine In" && !formData.no_table.trim()) newErrors.no_table = "Table number is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const userProfile = Cookies.get("profile");
    if (userProfile) {
      try {
        const userData = JSON.parse(userProfile);
        setProfile(userData.id);
      } catch (error) {
        console.error("Failed to parse user profile:", error);
      }
    }
  }, []);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      no_order: orderNumber || "Default_Order_Number",
    }));
  }, [orderNumber, activeButton]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      customer_name: customer.customer_name || "",
      order_type: customer.order_type || activeButton,
      no_table: customer.no_table || "",
    }));
  }, [customer]);

  useEffect(() => {
    setActiveButton(formData.order_type || "Dine In");
  }, [formData.order_type]);

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill out all required fields.");
      return;
    }

    if (selectedNominal < selectedMenusArray.reduce((sum, menu) => sum + menu.price * menu.quantity, 0) + 5000) {
      alert("Insufficient funds. Please check your balance");
      return;
    }

    try {
      // Prepare the order data
      const orderData = {
        id_user: profile,
        customer_name: formData.customer_name,
        no_table: formData.no_table,
        order_type: activeButton,
        no_order: formData.no_order,
        payment_nominal: selectedNominal,
        subtotal: selectedMenusArray.reduce((sum, menu) => sum + menu.price * menu.quantity, 0),
        tax: 5000,
        total: selectedMenusArray.reduce((sum, menu) => sum + menu.price * menu.quantity, 0) + 5000,
        status: 1,
        orderItems: selectedMenusArray.map((menu) => ({
          id_menu: menu.id,
          order_quantity: menu.quantity,
          price: menu.price,
          note: "empty",
        })),
      };

      // Make the API call using axios and await the response
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
      });

      // Check if the response is successful
      alert("Order submitted successfully!");
      setFormData({
        customer_name: null,
        no_table: null,
        order_type: activeButton,
        subtotal: null,
        tax: null,
        total: null,
        no_order: null,
        payment_nominal: 0,
        status: null,
        orderItems: [],
      });

      if (onSubmit) {
        onSubmit([]);
      }
      navigate("/payment-success", { state: response.data.id });
    } catch (error) {
      console.error("Error submitting order:", error);
      console.log("Error response:", error.response?.data || error.message);
      console.log("Order Data:", orderData);
      alert("An error occurred while submitting the order. Please try again.");
    }

    setFormData({
      customer_name: "",
      no_table: "",
    });

    setIsConfirming(false);
  };

  const handleArchiveClick = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Please fill out all required fields.");
      return;
    }

    // Prepare the order data
    const orderData = {
      id_user: profile, // Use the extracted user ID from the token
      customer_name: formData.customer_name,
      no_table: formData.no_table,
      order_type: activeButton,
      no_order: formData.no_order,
      payment_nominal: selectedNominal,
      subtotal: selectedMenusArray.reduce((sum, menu) => sum + menu.price * menu.quantity, 0),
      tax: 5000, // Static tax for now, you can adjust if needed
      total: selectedMenusArray.reduce((sum, menu) => sum + menu.price * menu.quantity, 0) + 5000,
      status: 0, // Default status, modify based on your needs
      orderItems: selectedMenusArray.map((menu) => ({
        id_menu: menu.id,
        order_quantity: menu.quantity,
        price: menu.price,
        note: "empty",
      })),
    };

    try {
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
      });

      console.log(response);
      setFormData({
        customer_name: null,
        no_table: null,
        order_type: activeButton,
        subtotal: null,
        tax: null,
        total: null,
        no_order: null,
        payment_nominal: 0,
        status: null,
        orderItems: [],
      });

      if (onSubmit) {
        onSubmit([]);
      }

      alert("Order archived successfully!");
    } catch (error) {
      console.error("Error archiving order:", error);
    }

    setFormData({
      customer_name: "",
      no_table: "",
    });
  };

  return (
    <>
      <div className="p-5 relative">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <p className="text-left text-xl font-medium">List Order</p>
            <span onClick={handleArchiveClick} className={`p-2 ${selectedMenusArray.length > 0 ? "text-blue-700" : "text-gray-400"}`}>
              <ArchiveButton />
            </span>
          </div>
          <div className="">
            <p className="text-[10px] font-medium text-gray-500">
              No Order: <span className="text-gray-500 font-bold">{orderNumber || "Loading..."}</span>
            </p>
          </div>
        </div>
        <form className="space-y-1">
          <div className="flex gap-4 mt-0">
            <div
              className={`flex-1 py-2 flex justify-center items-center ${activeButton === "Dine In" ? "bg-blue-500 text-white" : "bg-transparant border-2 text-gray-400"} rounded-md hover:bg-blue-600 cursor-pointer`}
              onClick={() => handleButtonClick("Dine In")}
            >
              Dine In
            </div>
            <div
              className={`flex-1 py-2 flex justify-center items-center ${activeButton === "Take Away" ? "bg-blue-500 text-white" : "bg-transparant border-2 text-gray-400"} rounded-md hover:bg-blue-600 cursor-pointer`}
              onClick={() => handleButtonClick("Take Away")}
            >
              Take Away
            </div>
          </div>
          {/* Customer Name */}
          {activeButton === "Dine In" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Customer Name"
                  className={`w-full mt-1 p-2 border rounded-xl focus:outline-none ${errors.customer_name ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                />
                {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">No. Table</label>
                <select
                  name="no_table"
                  value={formData.no_table}
                  onChange={handleChange}
                  className={`w-full mt-1 p-2 border rounded-xl focus:outline-none ${errors.no_table ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                >
                  <option value="" disabled>
                    Select Table
                  </option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                </select>
                {errors.no_table && <p className="text-red-500 text-xs mt-1">{errors.no_table}</p>}
              </div>
            </div>
          )}

          {activeButton === "Take Away" && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Customer Name </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="Customer Name"
                  className={`w-full mt-1 p-2 border rounded-xl focus:outline-none ${errors.customer_name ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
                />
                {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
              </div>
            </div>
          )}
          <div className="border"></div>

          {selectedMenusArray.length > 0 && (
            <div className="h-[250px] overflow-y-auto">
              {selectedMenusArray.map((menu) => (
                <MenuCardPosItem key={menu.id} onDeleteMenu={onDeleteMenu} selectedMenus={menu} onQuantityChange={(id, newQuantity) => updateMenuQuantity(id, newQuantity)} />
              ))}
            </div>
          )}

          {!selectedMenusArray.length > 0 && <div className="h-[38vh] flex items-center justify-center">No Menu Selected</div>}
          {selectedMenusArray.length > 0 && (
            <div className="mt-2 p-4 border-t mb-2 " style={{ backgroundColor: "#F7F7F7" }}>
              <div className=" text-sm flex justify-between text-lg">
                <p className=" text-gray-600">Subtotal</p>
                <p className="">Rp. {selectedMenusArray.reduce((sum, menu) => sum + menu.price * menu.quantity, 0).toLocaleString()}</p>
              </div>
              <div className="text-sm  flex justify-between text-lg">
                <p className=" text-gray-600">Tax </p>
                <p className="">Rp. 5.000</p>
              </div>
              <div className="flex justify-between text-lg  border-t-[2px] pt-2 mt-2 border-dashed ">
                <p className="text-lg">Total</p>
                <p className="text-2xl font-bold">Rp. {(selectedMenusArray.reduce((sum, menu) => sum + menu.price * menu.quantity, 0) + 5000).toLocaleString()}</p>
              </div>
            </div>
          )}

          {isConfirming ? (
            <div className="p-5 bg-white shadow-lg rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800">Select Payment Nominal</h2>
              <p className="text-sm text-gray-600">Please select the nominal you will pay:</p>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[50000, 75000, 100000].map((nominal) => (
                  <span
                    key={nominal}
                    onClick={() => setSelectedNominal(nominal)}
                    className={`p-4 border rounded-lg text-center font-medium ${selectedNominal === nominal ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
                  >
                    Rp. {nominal.toLocaleString()}
                  </span>
                ))}

                {/* Input field for custom nominal */}
                <div className="flex items-center border rounded-lg p-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter nominal"
                    value={selectedNominal}
                    onChange={(e) => setSelectedNominal(Number(e.target.value))}
                    className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    setIsConfirming(false);
                    setSelectedNominal(0);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={!selectedNominal} // Disable confirm button until a nominal is selected
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${selectedNominal ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePayClick}
              className={`w-full py-2 rounded-md text-white ${selectedMenusArray.length > 0 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
              disabled={selectedMenusArray.length === 0}
            >
              Pay
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default OrderForm;
