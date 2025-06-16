import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductDetails,
} from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";
import { Route, Routes, useNavigate } from "react-router-dom";
import {
  addToCartUnified,
  fetchCartItems,
  fetchGuestCartItems,
  selectCartItems,
  selectCartStatus,
} from "../store/cart-slice";
import ProductDetails from "./ProductDetails";
import { showSnackbar } from "../store/ui/snackbarslice";
import { Outlet } from "react-router-dom";

const Shop = () => {
  const { productList } = useSelector((state) => state.adminProducts);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const status = useSelector(selectCartStatus);

  const handleAddtoCart = async (getCurrentProductId, getTotalStock) => {
    // Stock check logic
    let getCartItems = cart.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => String(item.productId) === String(getCurrentProductId)
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          dispatch(
            showSnackbar({
              message: `You can only add ${getTotalStock} of this item in total. You already have ${getQuantity}.`,
              anchorOrigin: { vertical: "top", horizontal: "center" },
            })
          );

          return;
        }
      }
    }

    try {
      const action = await dispatch(
        addToCartUnified({
          productId: getCurrentProductId,
          quantity: 1,
          userId: user?.id,
          isAuthenticated: !!user?.id,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          if (user?.id) {
            dispatch(fetchCartItems(user?.id));
          } else {
            const guestId = localStorage.getItem("guestId");
            dispatch(fetchGuestCartItems(guestId));
          }

          dispatch(
            showSnackbar({
              message: "Item added to cart!",
              anchorOrigin: { vertical: "top", horizontal: "center" },
              severity: "success",
            })
          );
        }
      });
    } catch (error) {
      dispatch(
        showSnackbar({
          message: "Failed to add item to cart",
          anchorOrigin: { vertical: "top", horizontal: "center" },
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  return (
    <Routes>
      <Route
        index
        element={
          <div className="pt-30 px-8 md:px-6">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {productList?.map((productItem, i) => (
                <Shoptile
                  product={productItem}
                  key={productItem.product_id || i}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
            </div>
          </div>
        }
      />

      <Route
        path="product/:slug/:id"
        element={<ProductDetails handleAddtoCart={handleAddtoCart} />}
      />
    </Routes>
  );
};

export default Shop;
