// import React from "react";

// const DetailPopup = ({ isOpen, onClose, menuItem }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-xl">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-lg font-bold">Detail Menu</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
//             &times;
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-4">
//           {/* Image */}
//           <div className="w-full h-48 rounded-lg overflow-hidden">
//             <img src={menuItem.image} alt={menuItem.name} className="w-full h-full object-cover" />
//           </div>

//           {/* Tags */}
//           <div className="mt-4">{/* <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded">{menuItem.tag}</span> */}</div>

//           {/* Name */}
//           <h3 className="mt-2 text-xl font-semibold">{menuItem.name}</h3>

//           {/* Description */}
//           <p className="mt-2 text-gray-600">{menuItem.description}</p>

//           {/* Price */}
//           <div className="mt-4 text-lg font-bold text-blue-600">Rp {menuItem.price.toLocaleString()}/portion</div>

//           {/* Note Input */}
//           <div className="mt-4">
//             <label htmlFor="notes" className="block text-gray-700 text-sm font-semibold mb-1">
//               Note
//             </label>
//             {/* <textarea id="notes" placeholder="Enter your notes here..." className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} defaultValue={menuItem.notes} /> */}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="p-4 border-t">
//           <button onClick={() => alert("Order submitted!")} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
//             Submit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DetailPopup;
