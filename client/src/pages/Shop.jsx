import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchProductDetails,
} from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";

const Shop = () => {
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  return (
    <div className="px-8 md:px-6">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {productList?.map((productItem, i) => (
          <Shoptile product={productItem} key={productItem.product_id || i} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
