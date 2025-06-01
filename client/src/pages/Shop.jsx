import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";

const Shop = () => {
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  return (
    <div className="pt-30 px-8 md:px-6">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem, i) => (
              <Shoptile product={productItem} key={productItem.id || i} />
            ))
          : null}
      </div>
    </div>
  );
};

export default Shop;
