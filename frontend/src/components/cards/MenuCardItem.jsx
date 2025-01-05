import React from "react";
import { ShowMore } from "../../assets/icons/index";

const MenuCardItem = ({ menu, imageSrc, title, description, price, category, onClick, isActive }) => {
  return (
    // <div className={`p-4 border rounded-lg shadow-lg cursor-pointer bg-white hover:bg-gray-100 ${isActive ? "border-2 border-blue-500" : "border border-gray-300"}`} onClick={() => onClick(menu)}>
    <div className={`h-[232px] border rounded-lg cursor-pointer bg-white ${isActive ? "border-2 border-blue-500" : "border border-gray-300"}`} onClick={() => onClick(menu)}>
      {/* Gambar */}
      <div className="h-[120px] bg-gray-200 rounded-[10px] mb-4 flex items-center justify-center overflow-hidden m-[10px] m mb-[5px] relative">
        <img src={imageSrc} alt="Menu Item" className="object-cover w-full h-full" />
        <div className="bg-blue-500 text-white rounded-[20px] text-[12px] p-2.5 pt-1 pb-1 absolute top-2 right-2">{category}</div>
      </div>
      {/* Judul */}
      <h3 className="text-lg font-medium m-2.5 mb-0 text-gray-800">{title}</h3>
      {/* Deskripsi */}
      <p className="text-xs font-light text-gray-500 m-2.5 mt-0 mb-0">{description}</p>
      {/* Harga dan Tombol */}
      <div className="flex items-center justify-between m-2.5 mt-0">
        <p className="font-semibold text-sm text-blue-500">
          {price ? `Rp ${price.toLocaleString()}` : "Harga tidak tersedia"}
          <span className="font-light text-[10px] text-gray-500 ml-0">/portion</span>
        </p>
        {/* ShowMore di kanan */}
        <span>
          <ShowMore />
        </span>
      </div>
    </div>
  );
};

export default MenuCardItem;
