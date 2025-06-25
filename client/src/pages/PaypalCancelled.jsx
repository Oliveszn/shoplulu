import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

export default PayPalCancelPage;
