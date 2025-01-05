import React, { useState } from "react";
import { BASE_URL } from "../../config/api";
import { DeleteButtonPos, EditButtonPos } from "../../assets/icons/index";
import DetailPopup from "../popup/DetailPopup";

const MenuCardPosItem = ({ selectedMenus, onQuantityChange, onDeleteMenu }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const incrementQuantity = () => {
    onQuantityChange(selectedMenus.id, selectedMenus.quantity + 1);
  };

  const decrementQuantity = () => {
    onQuantityChange(selectedMenus.id, Math.max(1, selectedMenus.quantity - 1));
  };

  return (
    <div className="m-2 w-full h-[100px] flex items-center p-4 pl-0 relative">
      {" "}
      {/* Menambahkan relative positioning */}
      <img src={`${BASE_URL}${selectedMenus.photo}`} alt={selectedMenus.name} className="w-[100px] h-[100px] rounded-md object-cover" />
      <div className="ml-4 flex flex-col justify-between w-full">
        <div>
          <p className="text-lg font-medium text-gray-700">{selectedMenus.name}</p>
          <p className="text-sm text-gray-500 font-medium">Rp. {selectedMenus.price}</p>
        </div>
        <div className="absolute top-0 right-0 mt-2 mr-2">
          {" "}
          {/* Posisikan delete button di kanan atas */}
          <span onClick={() => onDeleteMenu(selectedMenus.id)}>
            <DeleteButtonPos />
          </span>
        </div>
        <span onClick={() => setIsDetailOpen(true)} className="m-1">
          <EditButtonPos></EditButtonPos>
        </span>
        <DetailPopup status="pos" isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} menuItem={selectedMenus} />

        <div className="self-end">
          <div className="flex items-center justify-end mt-2">
            <span onClick={decrementQuantity} className="w-8 h-8 text-white bg-gray-400 rounded-md flex items-center justify-center">
              -
            </span>
            <p className="mx-4 text-lg font-medium">{selectedMenus.quantity}</p>
            <span onClick={incrementQuantity} className="w-8 h-8 text-white bg-blue-500 rounded-md flex items-center justify-center">
              +
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCardPosItem;
