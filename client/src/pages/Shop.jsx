import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductDetails,
} from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGetProductDetails = async (getCurrentProductId) => {
    // dispatch(fetchProductDetails(getCurrentProductId));
    // navigate("/product");

    try {
      const result = await dispatch(
        fetchProductDetails(getCurrentProductId)
      ).unwrap();
      navigate("/product"); // Only navigate after successful fetch
    } catch (error) {
      console.error("Failed to fetch product:", error);
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
              />
            ))
          : null}
        {/* {productList && productList.length > 0
          ? productList.map((productItem, i) => {
              return (
                <Shoptile
                  product={productItem}
                  key={productItem.product_id || i}
                  handleGetProductDetails={handleGetProductDetails}
                />
              );
            })
          : null} */}
      </div>
    </div>
  );
};

export default Shop;
