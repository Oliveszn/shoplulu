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
import ShoppingBagSpinner from "../components/common/LoadingSpinner";

const ProductDetails = ({}) => {
  const { slug, id } = useParams();
  const { productDetails, isLoading } = useSelector(
    (state) => state.adminProducts
  );
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
    return <div>Product not found...</div>;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBagSpinner />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={productDetails.images?.[0]}
            alt={productDetails.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex flex-col space-y-6">
          {productDetails.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 w-fit capitalize">
              {productDetails.category}
            </span>
          )}

          <h1 className="text-3xl font-bold text-gray-900 leading-tight">
            {productDetails.name}
          </h1>

          {productDetails.price && (
            <div className="text-2xl font-semibold text-gray-900">
              ${productDetails.price}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Stock:</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                productDetails.stock > 10
                  ? "bg-green-100 text-green-800"
                  : productDetails.stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {productDetails.stock > 0
                ? `${productDetails.stock} available`
                : "Out of stock"}
            </span>
          </div>

          <div className="pt-4">
            <button
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                productDetails.stock > 0
                  ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={() =>
                handleAddtoCart(productDetails.product_id, productDetails.stock)
              }
              disabled={productDetails.stock === 0}
            >
              {productDetails.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">SKU:</span>
              <span className="text-gray-900">{productDetails.product_id}</span>
            </div>
            {productDetails.sub_category && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sub-Category:</span>
                <span className="text-gray-900 capitalize">
                  {productDetails.sub_category}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
