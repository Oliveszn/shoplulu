import React from "react";
import CartContent from "./CartContent";

const CartWrapper = ({ cart }) => {
  return (
    <div className="mt-8 space-y-4">
      {cart?.items?.length > 0
        ? cart.items.map((item) => {
            return <CartContent cart={item} key={item.productId} />;
          })
        : null}
    </div>
  );
};

export default CartWrapper;
