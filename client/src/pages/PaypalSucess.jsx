import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { clearPaymentInitiated } from "../store/orders-slice";
import { useEffect } from "react";

const PaypalSuccessPage = () => {
  const navigate = useNavigate();
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

  return (
    <div className="p-10">
      <div className="p-0">
        <div className="text-4xl">Payment is successfull!</div>
      </div>
      <Button className="mt-5" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </div>
  );
};

export default PaypalSuccessPage;
