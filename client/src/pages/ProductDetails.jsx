import React from "react";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const { productDetails } = useSelector((state) => state.adminProducts);
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
