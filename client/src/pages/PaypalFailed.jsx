import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearPaymentInitiated } from "../store/orders-slice";
import { Navigate } from "react-router-dom";

const PaypalFailed = () => {
  const { paymentInitiated } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearPaymentInitiated());
    };
  }, []);

  if (!paymentInitiated) {
    return <Navigate to="/" replace />;
  }
  return <div>your payment failed</div>;
};

export default PaypalFailed;
