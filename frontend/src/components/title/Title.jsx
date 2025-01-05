import React from "react";

const Title = ({ setTitle, setDate }) => {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-semibold text-gray-800">{setTitle}</h1>
        {setDate !== 0 && <span className="text-sm text-gray-500">Today, {currentDate}</span>}{" "}
      </div>
    </>
  );
};

export default Title;
