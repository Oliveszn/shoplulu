import React from "react";
import CartContent from "./CartContent";

const CartWrapper = ({ cart }) => {
  const totalCartAmount =
    cart?.items?.length > 0
      ? cart?.items?.reduce(
          (sum, currentItem) =>
            sum + currentItem?.price * currentItem?.quantity,
          0
        )
      : 0;

  return (
    <div className="mt-4 space-y-4 ">
      {cart?.items?.length > 0
        ? cart.items.map((item) => {
            return <CartContent cart={item} key={item.productId} />;
          })
        : null}
      <div className="mt-8">
        <div className="flex justify-between">
          <span className="font-bold">Total:</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <button className="w-full mt-6">Checkout</button>
    </div>
  );
};

export default CartWrapper;
