import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, Trash } from "lucide-react";
import {
  deleteCartItemUnified,
  updateCartQuantityUnified,
} from "../../store/cart-slice";
import { showSnackbar } from "../../store/ui/snackbarslice";

const CartContent = ({ cart: item }) => {
  const { cart } = useSelector((state) => state.cart);
  const { productList } = useSelector((state) => state.adminProducts);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleCartItemDelete = (item) => {
    dispatch(
      deleteCartItemUnified({
        productId: item?.productId,
        userId: user?.id,
        isAuthenticated: !!user?.id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(
          showSnackbar({
            message: "Item deleted from cart!",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
      }
    });
  };

  const handleUpdateQuantity = (getItem, typeOfAction) => {
    if (typeOfAction == "plus") {
      let getItems = cart.items || [];

      if (getItems.length) {
        const indexOfCurrentCartItem = getItems.findIndex(
          (item) => item.productId === getItem?.productId
        );
        if (productList) {
          const getCurrentProduct = productList.find(
            (product) =>
              String(product.product_id) === String(getItem?.productId)
          );

          if (getCurrentProduct?.stock !== undefined) {
            if (getItem.quantity + 1 > getCurrentProduct.stock) {
              dispatch(
                showSnackbar({
                  message: `Only ${getCurrentProduct.stock} available`,
                  anchorOrigin: { vertical: "top", horizontal: "center" },
                })
              );
              return;
            }
          }
        }

        // const getCurrentProductIndex = productList.findIndex(
        //   (product) => String(product.product_id) === String(getItem?.productId)
        // );
        // const getTotalStock = productList[getCurrentProductIndex].stock;

        // if (indexOfCurrentCartItem > -1) {
        //   const getQuantity = getItems[indexOfCurrentCartItem].quantity;
        //   if (getQuantity + 1 > getTotalStock) {
        //     dispatch(
        //       showSnackbar({
        //         message: `Only ${getQuantity} quantity can be added for this item`,
        //         anchorOrigin: { vertical: "top", horizontal: "center" },
        //       })
        //     );

        //     return;
        //   }
        // }
      }
    }

    dispatch(
      updateCartQuantityUnified({
        productId: getItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getItem?.quantity + 1
            : getItem?.quantity - 1,
        userId: user?.id,
        isAuthenticated: !!user?.id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(
          showSnackbar({
            message: "Cart item is updated successfully",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
      }
    });
  };
  return (
    <div>
      <div className="flex space-x-4">
        <img
          src={Array.isArray(item.image) ? item.image[0] : item.image}
          alt={item.name}
          className="w-20 h-20"
        />
        <div className="flex-1">
          <h3 className="font-normal uppercase">{item?.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <button
              className=""
              disabled={item?.quantity === 1}
              onClick={() => handleUpdateQuantity(item, "minus")}
            >
              <Minus className="w-4 h-4" />
              <span className="sr-only">Decrease</span>
            </button>
            <span className="font-normal">{item?.quantity}</span>
            <button
              className=""
              onClick={() => handleUpdateQuantity(item, "plus")}
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Decrease</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="font-normal">
            ${(item?.price * item?.quantity).toFixed(2)}
          </p>
          <Trash
            onClick={() => {
              handleCartItemDelete(item);
            }}
            className="cursor-pointer mt-1"
            size={15}
          />
        </div>
      </div>
      <hr className="my-6 border-t border-gray-500" />
    </div>
  );
};

export default CartContent;
