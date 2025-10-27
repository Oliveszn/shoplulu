import React from "react";
import CartContent from "./CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartWrapper = ({ cart }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const totalCartAmount =
    cart?.items?.length > 0
      ? cart?.items?.reduce(
          (sum, currentItem) =>
            sum + currentItem?.price * currentItem?.quantity,
          0
        )
      : 0;

  return (
    <div className="">
      <div className="mt-4 space-y-4 ">
        {cart?.items?.length > 0
          ? cart.items.map((item) => {
              return <CartContent cart={item} key={item.productId} />;
            })
          : null}
      </div>

      <div className="w-full">
        <div className="flex justify-between">
          <span className="font-bold">Subtotal:</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
        <button
          className={`w-full mt-6  text-white py-4 px-2  ${
            !isAuthenticated ? "bg-gray-500" : "bg-amber-950 cursor-pointer"
          }`}
          onClick={() => {
            navigate("/shop/checkout");
          }}
        >
          {isAuthenticated ? "Proceed to Checkout" : "Login to checkout"}
        </button>
      </div>
    </div>
  );
};

export default CartWrapper;
