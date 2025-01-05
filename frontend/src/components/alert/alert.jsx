import React from "react";

const Alert = ({ type = "info", message, onClose }) => {
  const alertStyles = {
    info: "bg-blue-100 border-blue-500 text-blue-700",
    success: "bg-white border-green-500 text-black",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    error: "bg-red-100 border-red-500 text-red-700",
  };

  return (
    <div className={`relative flex items-center p-4 mb-4 border-l-4 rounded shadow-lg ${alertStyles[type]}`} role="alert">
      <span className="ml-[0.5px]">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.9997 25.6693C20.4163 25.6693 25.6663 20.4193 25.6663 14.0026C25.6663 7.58594 20.4163 2.33594 13.9997 2.33594C7.58301 2.33594 2.33301 7.58594 2.33301 14.0026C2.33301 20.4193 7.58301 25.6693 13.9997 25.6693Z"
            stroke="#00AF10"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.04199 14.0048L12.3437 17.3065L18.9587 10.7031" stroke="#00AF10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {onClose && (
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none">
          ×
        </button>
      )}

      <div className="flex-grow">
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Alert;
