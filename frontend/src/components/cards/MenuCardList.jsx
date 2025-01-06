import React, { useState, useRef, useEffect } from "react";
import MenuCardItem from "./MenuCardItem";
import { BASE_URL } from "../../config/api";

const MenuCardList = ({ menus, activeTab, loading, onMenuClick }) => {
  const [activeItemId, setActiveItemId] = useState(false); // ID item aktif
  const [formMode, setFormMode] = useState("add"); // Mode form (add, view, edit)
  const containerRef = useRef(null); // Referensi ke elemen container

  // Filter item berdasarkan kategori
  const filteredItems =
    activeTab === "All Menu"
      ? menus
      : menus.filter((item) => {
          if (activeTab === "Foods") return item.category.toLowerCase() === "food";
          if (activeTab === "Beverages") return item.category.toLowerCase() === "beverage";
          if (activeTab === "Desserts") return item.category.toLowerCase() === "dessert";
          return false;
        });

  // Event saat item diklik
  const handleItemClick = (item) => {
    if (activeItemId === item.id) {
      // Jika item yang sama diklik, jangan ubah mode ke add
      setActiveItemId(false);
      setFormMode("add");
    } else {
      // Pilih item baru dan ubah ke mode "view"
      setActiveItemId(item.id);
      setFormMode("view");
    }

    if (onMenuClick) onMenuClick(item, formMode, activeItemId); // Callback item
  };

  // Menampilkan loading jika data belum tersedia
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // Render daftar menu
  return (
    <div className="h-[70vh] overflow-y-auto" ref={containerRef}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-500">No menu items available</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id}>
              <MenuCardItem
                menu={item}
                imageSrc={`${BASE_URL}${item.photo}`}
                title={item.name}
                description={item.description}
                price={item.price}
                category={item.category}
                isActive={item.id === activeItemId}
                onClick={() => handleItemClick(item)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuCardList;
