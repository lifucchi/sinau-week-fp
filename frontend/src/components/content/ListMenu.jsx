import React, { useState, useEffect } from "react";
import axios from "axios";
import { ExitButton, AddButton, FoodsIcon, BeveragesIcon, DessertsIcon, EditButton, DeleteButton, DeleteButtonIcon } from "../../assets/icons/index";
import MenuCardList from "../cards/MenuCardList";
import MenuForm from "../forms/MenuForm";
import { API_URL } from "../../config/api";
import Cookies from "js-cookie";
import Alert from "../alert/alert";

const ListMenu = () => {
  const [activeTab, setActiveTab] = useState("All Menu");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [menus, setMenus] = useState([]); // Menyimpan daftar menu
  const [loading, setLoading] = useState(false); // Menyimpan status loading

  const [selectedMenu, setSelectedMenu] = useState(null); // Data menu yang dipilih
  const [formMode, setFormMode] = useState("add"); // Mode form: "add", "view", "edit"

  const [showAlert, setShowAlert] = useState(false);
  const [showAlertM, setShowAlertM] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    console.log("Deleting item...");
    console.log(selectedMenu.id);
    const id = selectedMenu.id;

    try {
      await axios.delete(`${API_URL}/menus/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setMenus((prevMenus) => prevMenus.filter((menu) => menu.id !== id));

      setShowAlert(true);
      setShowAlertM("Menu successfully deleted!");
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to delete menu item:", error);

      // Tampilkan notifikasi kesalahan
      setShowAlert(true);
      setShowAlertM("Failed to delete menu item. Please try again.");
    }
  };
  const handleMenuClick = (menu, formMode, activeItemId) => {
    if (formMode === "add" && !activeItemId) {
      // Klik pertama pada item -> View Mode
      setSelectedMenu(menu);
      setFormMode("view");
      setIsFormVisible(true); // Tampilkan form
    } else if (formMode === "view" && activeItemId === menu.id) {
      // Klik item yang sama lagi -> Add Mode
      setFormMode("add");
      setIsFormVisible(false); // Sembunyikan form
    } else {
      // Klik item yang berbeda -> View Mode
      setSelectedMenu(menu);
      setFormMode("view");
      setIsFormVisible(true); // Tampilkan form
    }
  };

  const handleFormSubmit = async (successMessage) => {
    try {
      const response = await axios.get(`${API_URL}/menus`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setMenus(response.data); // Refresh data setelah submit
      setIsFormVisible(false);
      setFormMode("add");

      setShowAlert(true);
      setShowAlertM(successMessage);
    } catch (error) {
      console.error("Failed to refresh menus:", error);
    }
  };

  // Fetch data menus saat komponen dimuat
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/menus`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setMenus(response.data); // Menyimpan data menus ke dalam state
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  useEffect(() => {
    // Log menus setelah diperbarui
    // console.log("Updated menus:", menus);
  }, [menus, showAlert, showAlertM, isOpen]); // Menggunakan menus sebagai dependency untuk melihat perubahan

  return (
    <div className="grid grid-cols-3 gap-5 mt-5 w-full">
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gray-800 bg-opacity-50"
            onClick={() => setIsOpen(false)} // Close modal when clicking outside
          ></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-10">
            <div className="relative bg-white border border-gray-300 shadow-lg p-6 rounded-[20px] w-[500px] h-[374px]">
              <span className="m-5 flex justify-center items-center">
                <DeleteButtonIcon />
              </span>
              <h2 className="text-[28px] font-semibold  text-center">Are you sure you want to delete this file?</h2>
              <div className="mt-4 flex justify-between gap-4">
                <button onClick={() => setIsOpen(false)} className="w-1/2 px-4 py-2 bg-white text-white-800 rounded text-center border-2 rounded-lg">
                  Cancel
                </button>
                <button onClick={handleDelete} className="w-1/2 px-4 py-2 bg-red-600 text-white rounded text-center  rounded-lg">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Total Orders */}
      <div className="col-span-2 h-[64px]">
        <div className="flex flex-wrap lg:flex-nowrap justify-between items-center h-full m-0 rounded-[10px] gap-5">
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

      <div className="col-span-1 gap-5 min-h-screen flex flex-col">
        <div className="flex flex-col flex-1 bg-white border border-[#EBEBEB] rounded-[10px] relative">
          <div className="z-50">{showAlert && <Alert type="success" message={showAlertM} onClose={() => setShowAlert(false)} />}</div>

          <div className="flex justify-between items-center m-5  border-b p-5">
            <p className="text-left text-xl font-medium"> {formMode === "add" ? "Add Menu" : formMode === "edit" ? "Edit Menu" : "Detail Menu"}</p>

            <div className="z-20">
              {isFormVisible ? (
                formMode === "add" ? (
                  // Mode Add: Tampilkan ExitButton untuk keluar dari form
                  <span onClick={() => setIsFormVisible(false)}>
                    <ExitButton />
                  </span>
                ) : formMode === "view" ? (
                  // Mode View: Tampilkan DeleteButton dan EditButton
                  <div className="flex space-x-2">
                    <span onClick={() => setIsOpen(true)}>
                      <DeleteButton />
                    </span>
                    <span onClick={() => setFormMode("edit")}>
                      <EditButton />
                    </span>
                  </div>
                ) : null // Mode Edit: Tidak menampilkan tombol
              ) : formMode === "view" ? (
                // Mode View saat form tidak terlihat: Tampilkan EditButton
                <span
                  onClick={() => {
                    setFormMode("edit");
                    setIsFormVisible(true); // Tampilkan form
                  }}
                >
                  <EditButton />
                </span>
              ) : (
                // Mode Add saat form tidak terlihat: Tampilkan AddButton
                <span
                  onClick={() => {
                    setFormMode("add"); // Pastikan formMode diatur ke 'add'
                    setIsFormVisible(true); // Tampilkan form
                  }}
                >
                  <AddButton />
                </span>
              )}
            </div>
          </div>
          {isFormVisible ? (
            <MenuForm mode={formMode} menuData={selectedMenu} onSubmit={handleFormSubmit} onEdit={() => setFormMode("edit")} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">Add Menu here</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListMenu;
