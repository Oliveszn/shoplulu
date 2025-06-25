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

const PayPalCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any stored order data
    sessionStorage.removeItem("currentOrderId");
    sessionStorage.removeItem("currentPaymentId");
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. No charges were made.
        </p>
        <button
          onClick={() => navigate("/shop/checkout")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Checkout
        </button>
      </div>
    </div>
  );
};

export default { PaypalReturnPage, PayPalCancelPage };
