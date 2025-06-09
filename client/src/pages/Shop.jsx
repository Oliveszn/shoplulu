import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductDetails,
} from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  loadCartFromStorage,
  selectCartItems,
  selectCartStatus,
} from "../store/cart-slice";
import ProductDetails from "./ProductDetails";

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

  const handleAddToCart = (productId, quantity) => {
    console.log("Dispatching:", productId, quantity);
    dispatch(addToCart({ productId, quantity })).then((result) => {
      if (addToCart.fulfilled.match(result)) {
        console.log("Success!", result.payload);
      } else {
        console.log("Failed!", result.error);
      }
    });
  };

  // Add this useEffect
  useEffect(() => {
    // Check if we have a guest ID in localStorage
    const guestId = localStorage.getItem("guestId");

    if (!user && !guestId) {
      // If no user is logged in AND no guest ID exists
      const newGuestId = `guest_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
      localStorage.setItem("guestId", newGuestId);
      console.log("Generated new guest ID:", newGuestId);
    }

    // Load cart from localStorage
    dispatch(loadCartFromStorage());
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

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
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddToCart}
              />
            ))
          : null}
      </div>

      {/* <ProductDetails handleAddtoCart={handleAddtoCart}/> */}
    </div>
  );
};

export default Shop;
