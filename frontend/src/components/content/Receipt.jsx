import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { API_URL } from "../../config/api";
import axios from "axios";
import Cookies from "js-cookie";
const Receipt = ({ data, status, handleClose }) => {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState(false);

  const printRef = useRef();

  useEffect(() => {
    const fetchOrderItems = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/orders/${data}`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        setOrderItems(response.data || []);
      } catch (error) {
        console.error("Error fetching order items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (data) {
      fetchOrderItems();
    }
  }, [data]);

  useEffect(() => {}, [orderItems]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePrint = async () => {
    const printContent = printRef.current;
    setIsLoadingReceipt(true);
    try {
      const canvas = await html2canvas(printContent, {
        scale: 2,
        useCORS: true,
        width: printContent.offsetWidth, // Sesuaikan dengan lebar konten
        height: printContent.offsetHeight, // Sesuaikan dengan tinggi konten
      });

      const image = canvas.toDataURL("image/png");

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
      <html>
  <head>
    <title>Print Receipt</title>
    <style>
      body { text-align: center; margin: 0; }
      .receipt-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .scrollable-content {
                max-height: none;   /* Menghilangkan batas tinggi */

        overflow-y: visible; /* Allow vertical scrolling */
        overflow-x: hidden;

      }
      img {
        max-width: 50%; /* Prevent the image from being wider than the page */
        height: auto;
      }
    </style>
  </head>
  <body>
    <div class="scrollable-content">
      <img src="${image}" />
    </div>
  </body>
</html>

      `);

      await delay(500);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      console.error("Failed to generate canvas:", error);
    } finally {
      setIsLoadingReceipt(false);
    }
  };

  const handleExit = () => {
    if (status === "Success") {
      navigate("/pos");
    }
  };
  const orderDate = new Date(orderItems.createdAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="relative bg-white h-[90%] w-[90%] max-w-[610px] p-10 pt-0 rounded-[20px] border border-gray-300 shadow-lg">
        {/* Tombol Exit */}
        {status === "Success" ? (
          <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={handleExit}>
            ✕
          </button>
        ) : status === "Detail" ? (
          <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={handleClose}>
            ✕
          </button>
        ) : null}

        {/* Konten */}

        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-4xl font-semibold text-gray-800 mb-4 p-[100px] pb-2.5 ">Transaction {status}</h2>
          {isLoading || !orderItems.no_order ? (
            <div> LOADING</div>
          ) : (
            <div ref={printRef} className="flex items-center justify-center bg-[#F7F7F7] overflow-y ">
              {" "}
              <div className=" bg-[#F7F7F7] w-[350px] rounded-[20px] p-6 ">
                <div className="text-xs text-gray-600">
                  <p>
                    No Order <span className="font-semibold text-gray-700">{orderItems.no_order}</span>
                  </p>
                  <p>
                    Order Date <span className="font-semibold text-gray-700">{orderDate}</span>
                  </p>
                  <p>
                    Customer Name <span className="font-semibold text-gray-700">{orderItems.customer_name}</span>
                  </p>
                  <p className="text-black">
                    {orderItems.order_type} - <span className="font-semibold text-black"> {orderItems.order_type === "Dine In" ? `No. Meja ${orderItems.no_table}` : null}</span>
                  </p>
                </div>
                <div className="border-dashed border-t my-4"></div>

                {orderItems.ListOrderDetails.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center text-gray-800 font-semibold">
                      <p className="text-lg">{item.Menu.name}</p>
                      <p className="text-sm">Rp {item.price.toLocaleString()}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {item.order_quantity} x Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="border-dashed border-t border-2 my-4"></div>
                <div className="text-sm text-gray-700">
                  <div className="flex justify-between">
                    <p className="text-gray-500">subtotal</p>
                    <p>Rp {orderItems.subtotal.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">tax</p>
                    <p>Rp {orderItems.tax.toLocaleString()}</p>
                  </div>
                </div>
                <div className="border-dashed border-t border-2 my-4"></div>
                <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                  <p>Total</p>
                  <p>Rp {orderItems.total.toLocaleString()}</p>
                </div>
                <div className="border-dashed border-t my-4"></div>
                <div className="text-sm text-black">
                  <div className="flex justify-between">
                    <p className="text-gray-500">Diterima</p>
                    <p>Rp {orderItems.payment_nominal.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-500">Kembalian</p>
                    <p>Rp {(orderItems.payment_nominal - orderItems.total).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-center">
            {status === "Success" && (
              <button className="flex items-center justify-center px-4 py-2 gap-2 w-[350px] h-[48px] bg-[#3572EF] text-white text-sm font-semibold rounded-[10px] hover:bg-blue-600" onClick={handlePrint}>
                Print Receipt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
