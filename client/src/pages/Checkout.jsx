import React, { useState } from "react";
import Address from "../components/address/Address";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CartContent from "../components/cart/CartContent";
import { showSnackbar } from "../store/ui/snackbarslice";
import { clearApprovalURL, createNewOrder } from "../store/orders-slice";
import { useEffect } from "react";

const Checkout = () => {
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { approvalURL } = useSelector((state) => state.order);
  const { productList } = useSelector((state) => state.adminProducts);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const totalCartAmount =
    cart?.items?.length > 0
      ? cart?.items?.reduce(
          (sum, currentItem) =>
            sum + currentItem?.price * currentItem?.quantity,
          0
        )
      : 0;

  const handleInitiatePaypalPayment = () => {
    if (!cart.items || cart.items.length === 0) {
      showSnackbar({
        message: "Your cart is empty. Please add items to proceed",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });

      return;
    }
    if (!currentSelectedAddress) {
      showSnackbar({
        message: "Please select one address to proceed.",
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });

      return;
    }

    const orderData = {
      userId: parseInt(user?.id),
      cartId: cart?.cart_id,
      selectedAddressId: currentSelectedAddress?.id,
      paymentMethod: "paypal",
      totalAmount: totalCartAmount,

      cartItems: cart.items.map((item) => ({
        productId: item?.productId,
        name: item?.name,
        images: item?.image ? [item.image] : [], // Ensure it's an array
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data, "sangam");
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
      } else {
        setIsPaymemntStart(false);
        console.error("Order creation failed:", data?.payload?.message);
      }
    });
  };

  useEffect(() => {
    if (approvalURL && isPaymentStart) {
      console.log("Redirecting to PayPal:", approvalURL);
      window.location.href = approvalURL;
    }
  }, [approvalURL, isPaymentStart]);

  // Clear approval URL when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearApprovalURL());
    };
  }, [dispatch]);
  return (
    <div className="flex flex-col">
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
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
