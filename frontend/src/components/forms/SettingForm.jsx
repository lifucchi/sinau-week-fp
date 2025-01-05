import React, { useState, useEffect, useContext } from "react";
import { API_URL, BASE_URL } from "../../config/api";
import Cookies from "js-cookie";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const SettingForm = () => {
  const [formValues, setFormValues] = useState({
    email: "",
    username: "",
    role: "",
    status: "",
    language: "",
    photo: null,
    preferance: "",
    fontSize: "",
    zoomDisplay: "",
  });
  const { login } = useContext(AuthContext);

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isChanged, setIsChanged] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [password, setPassword] = useState(""); // Untuk menyimpan password
  const [isChangedPassword, setIsChangedPassword] = useState(false); // Untuk mendeteksi perubahan

  // Handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (validTypes.includes(file.type)) {
        setImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);

        setFormValues({
          ...formValues,
          photo: file,
        });
        setIsChanged(true);
      } else {
        alert("Invalid file type. Only jpg, jpeg, and png files are allowed.");
      }
    }
  };

  const handleDelete = () => {
    setImage(null);
    setPreviewUrl("");
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsChanged(true);
  };

  const handleChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setIsChangedPassword(newPassword.trim() !== "");
  };

  // Fetch initial data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });
        setFormValues({
          email: response.data.user.email || "",
          username: response.data.user.username || "",
          role: response.data.user.role || "",
          status: response.data.user.status || "",
          language: response.data.user.language || "",
          preferance: response.data.user.preferance || "",
          fontsize: response.data.user.fontsize || "",
          zoomdisplay: response.data.user.zoomdisplay || "",
          photo: response.data.user.photo || "",
        });

        setImage(`${BASE_URL}${response.data.user.photo}`);
        setPreviewUrl(`${BASE_URL}${response.data.user.photo}`);

        Cookies.set("role", response.data.user.role, { expires: 7 });
        Cookies.set("profile", JSON.stringify(presponse.data.user), { expires: 7 });
        Cookies.set("profilepic", response.data.user.photo, { expires: 7 });

        // login(Cookies.get("token"));
      } catch (err) {
        setError(err.response?.data?.message || "");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {}, [formValues, previewUrl, image]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();

      for (const [key, value] of Object.entries(formValues)) {
        if (key !== "photo" && value) {
          // Menghindari menambahkan 'photo' yang berisi file
          formData.append(key, value);
        }
      }

      // Menambahkan file foto ke FormData
      if (formValues.photo) {
        formData.append("photo", formValues.photo);
      }

      // Mengirimkan request PUT
      const response = await axios.put(`${API_URL}/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsChanged(false);
      Cookies.set("role", response.data.user.role, { expires: 7 });
      Cookies.set("profile", JSON.stringify(response.data.user), { expires: 7 });
      Cookies.set("profilepic", response.data.user.photo, { expires: 7 });

      alert("Updated");
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handleSubmitPassword = async () => {
    try {
      const email = formValues.email;

      // Kirim permintaan ke server
      const response = await axios.put(
        `${API_URL}/auth/change-password`,
        {
          email,
          newPassword: password,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.response?.data?.message || "Failed to update password. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <span className="text-[20px] m-2.5 ml-0">Account</span>
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
      <div className="flex flex-wrap gap-4">
        {["email", "username"].map((field) => (
          <div className="flex flex-col gap-1 w-[420px] m-2.5" key={field}>
            <label htmlFor={field} className="text-sm font-medium text-gray-500 capitalize">
              {field}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              placeholder={`Enter ${field} here`}
              className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formValues[field]}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="flex flex-col gap-1 w-[420px] m-2.5">
          <label htmlFor="statys" className="text-sm font-medium text-gray-500 capitalize">
            Status
          </label>
          <input
            type="text"
            id="status"
            name="status"
            placeholder={`Enter status here`}
            className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValues.status}
            onChange={handleChange}
          />
        </div>
        {/* Role as Select */}
        <div className="flex flex-col gap-1 w-[420px] m-2.5">
          <label htmlFor="role" className="text-sm font-medium text-gray-500">
            Role
          </label>
          <select id="role" name="role" value={formValues.role} onChange={handleChange} className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
          </select>
        </div>
        {/* Language as Select */}
        <div className="flex flex-col gap-1 w-[420px] m-2.5">
          <label htmlFor="language" className="text-sm font-medium text-gray-500">
            Language
          </label>
          <select id="language" name="language" value={formValues.language} onChange={handleChange} className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Language</option>
            <option value="english">English</option>
            <option value="indonesian">Indonesian</option>
          </select>
        </div>
      </div>
      {/* Other fields */}
      <span className="text-[20px] ml-0 mt-[60px]">Password</span>
      <div className="flex flex-col gap-1 lg:w-[420px] sm:w-[320px] m:w-[320px] m-2.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-500">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter new password here"
          className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 "
          value={password || ""}
          onChange={handleChangePassword}
        />
      </div>
      <button
        type="button"
        onClick={handleSubmitPassword}
        className={`text-[12px] m-2.5 text-white flex items-center justify-center p-[8px_12px] gap-[10px] w-[121px] h-[34px] rounded-[10px] ${isChangedPassword ? "bg-[#3572EF] hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!isChangedPassword}
      >
        Change Password
      </button>
      <span className="text-[20px] m-2.5 ml-0">Appearance</span>
      <div className="flex flex-wrap items-center gap-4 m-2.5 ml-0">
        {/* Preference Mode */}
        <div className="flex flex-col gap-1 w-full sm:w-[420px] m-2.5">
          <label htmlFor="preferance" className="text-sm font-medium text-gray-500 capitalize">
            Preference Mode
          </label>
          <select id="preferance" name="preferance" className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formValues.preferance || ""} onChange={handleChange}>
            <option value="">Select Mode</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Font Size */}
        <div className="flex flex-col gap-1 w-full sm:w-[420px] m-2.5">
          <label htmlFor="fontsize" className="text-sm font-medium text-gray-500 capitalize">
            Font Size
          </label>
          <select id="fontsize" name="fontsize" className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formValues.fontsize || ""} onChange={handleChange}>
            <option value="">Select Font Size</option>
            <option value="16px">16px</option>
          </select>
        </div>

        {/* Zoom Display */}
        <div className="flex flex-col gap-1 w-full sm:w-[420px] m-2.5">
          <label htmlFor="zoomdisplay" className="text-sm font-medium text-gray-500 capitalize">
            Zoom Display
          </label>
          <select id="zoomdisplay" name="zoomdisplay" className="w-full h-10 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" value={formValues.zoomdisplay || ""} onChange={handleChange}>
            <option value="">Select Zoom Level</option>
            <option value="100">100 (Normal)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className={`text-[12px] m-2.5 text-white flex items-center justify-center p-[8px_12px] gap-[10px] w-[121px] h-[34px] rounded-[10px] ${isChanged ? "bg-[#3572EF] hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        disabled={!isChanged}
      >
        Save Changes
      </button>
    </form>
  );
};

export default SettingForm;
