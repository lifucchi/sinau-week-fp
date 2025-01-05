import React, { useState } from "react";
import { API_URL } from "../../config/api";
import Cookies from "js-cookie";
import axios from "axios";

const PictureForm = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDelete = () => {
    setImage(null);
    setPreviewUrl("");
  };

  return (
    <div>
      <div className="flex flex-row items-center gap-4 m-2.5 ml-0">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center border border-gray-300 shadow">
          {previewUrl ? <img src={previewUrl} alt="Profile" className="w-full h-full object-cover rounded-full" /> : <span className="text-gray-400">Picture</span>}
        </div>

        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
        <label
          htmlFor="image-upload"
          className="flex text-[12px] justify-center items-center px-3 py-2 gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          style={{ width: "106px", height: "34px" }}
        >
          Change Picture
        </label>

        <button
          type="button"
          onClick={handleDelete}
          className="flex text-[12px] justify-center items-center px-3 py-2 gap-2 bg-transparent border border-blue-500 text-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ width: "106px", height: "34px" }}
          disabled={!previewUrl}
        >
          Delete Picture
        </button>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default PictureForm;
