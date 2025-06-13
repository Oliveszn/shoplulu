import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductDetails,
} from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";
import { useNavigate } from "react-router-dom";
import {
  addToCartUnified,
  fetchCartItems,
  fetchGuestCartItems,
  selectCartItems,
  selectCartStatus,
} from "../store/cart-slice";
import ProductDetails from "./ProductDetails";
import { showSnackbar } from "../store/ui/snackbarslice";

const Shop = () => {
  const { productList } = useSelector((state) => state.adminProducts);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const status = useSelector(selectCartStatus);

  const handleGetProductDetails = async (getCurrentProductId) => {
    try {
      const result = await dispatch(
        fetchProductDetails(getCurrentProductId)
      ).unwrap();
      navigate("/product");
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  const handleAddtoCart = (getCurrentProductId, getTotalStock) => {
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

    // Single dispatch that handles both user and guest
    dispatch(
      addToCartUnified({
        productId: getCurrentProductId,
        quantity: 1,
        userId: user?.id,
        isAuthenticated: !!user?.id,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        // Refresh cart items based on user type
        if (user?.id) {
          dispatch(fetchCartItems(user?.id));
        } else {
          // Handle guest cart refresh if needed
          const guestId = localStorage.getItem("guestId");
          dispatch(fetchGuestCartItems(guestId));
        }

        dispatch(
          showSnackbar({
            message: "Item added to cart!",
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
      }
    });
  };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  return (
    <div className="pt-30 px-8 md:px-6">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem, i) => (
              <Shoptile
                product={productItem}
                key={productItem.product_id || i}
                // handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default Shop;
