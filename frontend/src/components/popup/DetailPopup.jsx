import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config/api";

const DetailPopup = ({ isOpen, onClose, menuItem, status, onSaveNote }) => {
  const [note, setNote] = useState(menuItem.notes || "");
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(note.trim() === "");
  }, [note]);

  const handleSubmit = () => {
    onSaveNote(menuItem.id, note);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white h-auto w-[50%] max-w-[500px] p-5 pt-0 rounded-[20px] border border-gray-300 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
            &times;
          </button>
        </div>
        <div className="flex justify-center items-center m-4 border-b">
          <h2 className="text-lg font-bold">Detail Menu</h2>
        </div>

        {/* Content */}
        <div className="">
          {/* Image */}
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <img src={`${BASE_URL}${menuItem.photo}`} alt={menuItem.name} className="w-full h-full object-cover" />
          </div>

          {/* Tags */}
          <div className="mt-4">
            <span className="inline-block px-3 py-1 text-sm bg-blue-500 text-white rounded-[20px] text-[12px]">{menuItem.category}</span>
          </div>

          {/* Name */}
          <h3 className="text-lg font-medium  mb-0 text-gray-800">{menuItem.name}</h3>

          {/* Description */}
          <p className="text-xs font-light text-gray-500 mt-0 mb-0">{menuItem.description}</p>

          {/* Price */}
          <div className="font-semibold text-sm text-blue-500">
            Rp {menuItem.price ? `Rp ${menuItem.price.toLocaleString()}` : "Harga tidak tersedia"}
            <span className="font-light text-[10px] text-gray-500 ml-0">/portion</span>
          </div>

          {/* Note Input */}
          {status === "pos" && (
            <div className="mt-4 ">
              <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-1">
                Add Note
              </label>
              <textarea
                id="notes"
                placeholder="Enter your notes here..."
                className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        {status === "pos" && (
          <div className="p-4 border-t w-full">
            <span onClick={handleSubmit} className={`w-full py-2 px-4 rounded font-semibold text-white ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 "}`} disabled={isDisabled}>
              Submit
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPopup;
