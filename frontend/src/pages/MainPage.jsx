import React from "react";

const MainPage = ({ setTitle, setDate, children }) => {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{setTitle}</h1>
        {(setTitle === "Dashboard" || setTitle === "Sales Report") && (
          <>
            <span className="text-gray-500">Today, {currentDate}</span>
          </>
        )}
      </div>
      <div className="flex flex-col space-y-4">{children}</div>
    </div>
  );
};

export default MainPage;
