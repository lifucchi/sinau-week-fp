import React from "react";
import OrderSummary from "./OrderSummary";
import SalesReportable from "../table/SalesReportable";

const SalesReportCashier = () => {
  return (
    <div>
      <OrderSummary role="cashier"></OrderSummary>
      <SalesReportable role="cashier"></SalesReportable>
    </div>
  );
};

export default SalesReportCashier;
