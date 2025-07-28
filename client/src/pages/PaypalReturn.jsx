import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { capturePayment } from "../store/orders-slice";

const PaypalReturnPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [searchParams] = useSearchParams();
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");
  const { isLoading } = useSelector((state) => state.shopOrder);

  //   useEffect(() => {
  //     if (paymentId && payerId) {
  //       const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

  //       dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
  //         if (data?.payload?.success) {
  //           sessionStorage.removeItem("currentOrderId");
  //           window.location.href = "/shop/paypal-success";
  //         }
  //       });
  //     }
  //   }, [paymentId, payerId, dispatch]);

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const payerId = searchParams.get("PayerID");

    // Get orderId from sessionStorage
    const storedOrderId = sessionStorage.getItem("currentOrderId");
    const orderId = storedOrderId ? JSON.parse(storedOrderId) : null;

    console.log("PayPal return params:", { paymentId, payerId, orderId });

    if (paymentId && payerId && orderId) {
      // Capture the payment
      dispatch(
        capturePayment({
          paymentId,
          payerId,
          orderId,
        })
      ).then((result) => {
        if (result?.payload?.success) {
          console.log("Payment captured successfully:", result.payload);
          navigate("/shop/payment-success", {
            state: { orderData: result.payload.data },
          });
        } else {
          console.error("Payment capture failed:", result?.payload?.message);
          navigate("/shop/payment-failed");
        }
      });
    } else {
      console.error("Missing payment parameters");
      navigate("/shop/payment-failed");
    }
  }, [dispatch, navigate, searchParams]);

  return (
    <div>
      <div>
        <div>Processing Payment...Please wait!</div>
      </div>
    </div>
  );
};



export default PaypalReturnPage;
