import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { fetchProductDetails } from "../store/admin/products-slice";
import { showSnackbar } from "../store/ui/snackbarslice";
import {
  addToCartUnified,
  fetchCartItems,
  fetchGuestCartItems,
} from "../store/cart-slice";

const ProductDetails = ({}) => {
  const { slug, id } = useParams();
  const { productDetails } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

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
      console.log(error);

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
    if (id) dispatch(fetchProductDetails(id));
  }, [id, dispatch]);

  if (!productDetails) {
    return <div>Loading product or product not found...</div>;
  }

  return (
    <div>
      <div>
        <img src={productDetails.images?.[0]} />
        <h1 className="">{productDetails.name}</h1>
      </div>
      <button
        className="p-4 bg-red-500 text-white cursor-pointer hover:opacity-50"
        onClick={() =>
          handleAddtoCart(productDetails.product_id, productDetails.stock)
        }
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
