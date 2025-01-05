import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Cookies from "js-cookie";
import { API_URL, BASE_URL } from "../../config/api";

const MenuForm = ({ mode = "add", menuData = null, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!formData.description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  // Initialize form based on mode and menuData
  useEffect(() => {
    if (menuData && (mode === "edit" || mode === "view")) {
      setFormData({
        name: menuData.name || "",
        category: menuData.category || "",
        price: menuData.price || "",
        description: menuData.description || "",
      });
      if (menuData.photo) {
        setImagePreview(`${BASE_URL}${menuData.photo}`);
      }
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        description: "",
      });
      setImagePreview(null);
      setUploadedFile(null);
    }
  }, [menuData]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (mode === "view") return; // Disable file upload in view mode
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        setUploadedFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("Please upload a valid image file.");
      }
    },
    [mode]
  );

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleChange = (e) => {
    if (mode === "view") return; // Disable input changes in view mode
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // Stop if validation fails

    if (mode === "view") return; // Prevent form submission in view mode

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("description", formData.description);

    if (uploadedFile) {
      formDataToSubmit.append("photo", uploadedFile);
    }

    try {
      const url = mode === "edit" ? `${API_URL}/menus/${menuData.id}` : `${API_URL}/menus`;
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token") || ""}`,
        },
        method,
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the form");
      }

      const successMessage = mode === "edit" ? "Menu successfully updated!" : "New menu successfully added!";
      if (onSubmit) onSubmit(successMessage);
    } catch (error) {
      console.error(error);
      alert("Error while submitting the form");
    }
  };

  return (
    <>
      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            {...getRootProps()}
            className={`w-full h-64 border-2 border-dashed flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition relative overflow-hidden ${mode === "view" ? "cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} disabled={mode === "view"} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-10" />}
            {!imagePreview && <div className="text-gray-500 z-20 bg-white bg-opacity-50 px-2 py-1 rounded-lg">Drag and drop a picture here, or click to select</div>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name here"
              value={formData.name}
              onChange={handleChange}
              disabled={mode === "view"}
              className={`w-full mt-1 p-2 border rounded-xl focus:outline-none ${mode === "view" ? "bg-gray-100 cursor-not-allowed" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={mode === "view"}
              className={`w-full mt-1 p-2 border rounded-xl focus:outline-none ${mode === "view" ? "bg-gray-100 cursor-not-allowed" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Food">Food</option>
              <option value="Beverage">Beverage</option>
              <option value="Dessert">Dessert</option>
            </select>
            {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price here"
              value={formData.price}
              onChange={handleChange}
              disabled={mode === "view"}
              className={`w-full mt-1 p-2 border rounded-xl focus:outline-none ${mode === "view" ? "bg-gray-100 cursor-not-allowed" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Add description here"
              value={formData.description}
              onChange={handleChange}
              disabled={mode === "view"}
              className={`w-full mt-1 p-2 border rounded-xl focus:outline-none ${mode === "view" ? "bg-gray-100 cursor-not-allowed" : "border-gray-300 focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>
          {mode !== "view" && (
            <div>
              <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                {mode === "edit" ? "Save" : "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default MenuForm;
