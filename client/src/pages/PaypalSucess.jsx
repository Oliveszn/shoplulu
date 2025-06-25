import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaypalSuccessPage = () => {
  const navigate = useNavigate();

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
