import React, { useState } from "react";
import Address from "../components/address/Address";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import CartContent from "../components/cart/CartContent";

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { productList } = useSelector((state) => state.adminProducts);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const totalCartAmount =
    cart?.items?.length > 0
      ? cart?.items?.reduce(
          (sum, currentItem) =>
            sum + currentItem?.price * currentItem?.quantity,
          0
        )
      : 0;

  return (
    <div className="flex flex-col">
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div>hel</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cart?.items?.length > 0
            ? cart.items.map((item) => (
                <CartContent
                  cart={item}
                  key={item.productId}
                  productList={productList}
                />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button>Checkout with Paypal</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
