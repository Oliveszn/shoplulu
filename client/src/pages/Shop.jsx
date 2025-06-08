import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductDetails,
} from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../store/cart-slice";
import ProductDetails from "./ProductDetails";

const Shop = () => {
  const { productList } = useSelector((state) => state.adminProducts);
  const { cart, isLoading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cartFeedback, setCartFeedback] = useState({
    visible: false,
    message: "",
    isError: false,
  });

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

  const handleAddtoCart = async (productId, totalStock, quantity = 1) => {
    // try {
    //   // Validate stock (assumes product data includes stock)
    //   if (totalStock <= 0) {
    //     console.error("Product is out of stock");
    //     return;
    //   }

    //   // Check current cart for item (optional, for UI feedback)
    //   const existingItem = cart.items.find(
    //     (item) => item.productId === productId
    //   );
    //   if (existingItem && existingItem.quantity >= totalStock) {
    //     console.error("Cannot add more items than available stock");
    //     return;
    //   }

    //   // Dispatch addToCart action
    //   const result = await dispatch(
    //     addToCart({
    //       productId,
    //       quantity: 1,
    //     })
    //   ).unwrap(); // unwrap() throws errors for rejected thunks

    //   // Show success feedback
    //   console.log("Product added to cart");
    // } catch (error) {
    //   console.error(error || "Failed to add to cart");
    // }

    try {
      // Reset previous feedback
      setCartFeedback({ visible: false, message: "", isError: false });

      // Validate stock
      if (totalStock <= 0) {
        setCartFeedback({
          visible: true,
          message: "Product is out of stock",
          isError: true,
        });
        return;
      }

      // Check current cart
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );
      const availableQty = totalStock - (existingItem?.quantity || 0);

      if (availableQty < quantity) {
        setCartFeedback({
          visible: true,
          message: `Only ${availableQty} available`,
          isError: true,
        });
        return;
      }

      // Dispatch action
      await dispatch(addToCart({ productId, quantity })).unwrap();

      // Success feedback
      setCartFeedback({
        visible: true,
        message: `Added ${quantity} item${quantity > 1 ? "s" : ""} to cart`,
        isError: false,
      });
    } catch (error) {
      setCartFeedback({
        visible: true,
        message: error.message || "Failed to add to cart",
        isError: true,
      });
    }
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
                handleGetProductDetails={handleGetProductDetails}
                handleAddtoCart={handleAddtoCart}
              />
            ))
          : null}
      </div>

      {/* <ProductDetails handleAddtoCart={handleAddtoCart}/> */}
      {cartFeedback.visible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md 
    ${
      cartFeedback.isError
        ? "bg-red-100 text-red-800"
        : "bg-green-100 text-green-800"
    }`}
        >
          {cartFeedback.message}
        </div>
      )}
    </div>
  );
};

export default Shop;
