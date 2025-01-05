import React from "react";
import { useLocation } from "react-router-dom";

import Receipt from "../components/content/receipt";

const PaymentPage = () => {
  const location = useLocation();
  const orderData = location.state;
  return <>{orderData ? <Receipt data={orderData} status={"Success"} /> : <p>Loading...</p>}</>;
};

export default PaymentPage;
