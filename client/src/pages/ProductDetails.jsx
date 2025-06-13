import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchProductDetails } from "../store/admin/products-slice";

const ProductDetails = () => {
  const { id } = useParams();
  const { productDetails } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
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
      <button className="p-4 bg-red-500 text-white cursor-pointer hover:opacity-50">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetails;
