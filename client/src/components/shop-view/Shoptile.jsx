import React from "react";
import { selectCartItems, selectCartStatus } from "../../store/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import ProductDetails from "../../pages/ProductDetails";
import { useNavigate } from "react-router-dom";
import { fetchProductDetails } from "../../store/admin/products-slice";

const Shoptile = ({ product, handleGetProductDetails, handleAddtoCart }) => {
  const items = useSelector(selectCartItems);
  const status = useSelector(selectCartStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const createSlug = (str) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single
      .replace(/^-+/, "") // Trim - from start
      .replace(/-+$/, ""); // Trim - from end
  };

  const goToProductDetails = async () => {
    try {
      const productId = product.product_id || product.id;

      const slug = createSlug(product.name);
      navigate(`/shop/product/${slug}/${productId}`);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
  };

  return (
    <>
      <div
        className="w-full max-w-sm mx-auto bg-transparent shadow"
        onClick={goToProductDetails}
      >
        <div className="">
          <div className="relative group h-[400px] overflow-hidden">
            <img
              src={product?.images?.[0]}
              alt={product?.title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 opacity-100"
              loading="lazy"
            />
            <img
              src={product?.images?.[1]}
              alt={product?.title}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500"
            />

            <div className="absolute bottom-[-60px] opacity-0 bg-black text-white w-full flex items-center justify-between p-4 group-hover:bottom-0 group-hover:opacity-100 transition-all duration-700 ease-in-out">
              Select Options
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g id="Eye">
                  <path
                    id="Vector"
                    d="M12.0002 19.0312C10.5658 19.0312 9.08457 18.675 7.59394 17.9766C6.42676 17.4281 5.2502 16.6687 4.09707 15.7172C2.15176 14.1094 0.951758 12.5156 0.900195 12.45C0.698633 12.1828 0.698633 11.8172 0.900195 11.55C0.951758 11.4844 2.15176 9.89062 4.09707 8.28281C5.2502 7.33125 6.42676 6.57187 7.59394 6.02344C9.08457 5.325 10.5658 4.96875 12.0002 4.96875C13.4346 4.96875 14.9158 5.325 16.4064 6.02344C17.5736 6.57187 18.7502 7.33125 19.9033 8.28281C21.8486 9.89062 23.0533 11.4844 23.1002 11.55C23.3018 11.8172 23.3018 12.1828 23.1002 12.45C23.0486 12.5156 21.8486 14.1094 19.9033 15.7172C18.7502 16.6687 17.5736 17.4281 16.4064 17.9766C14.9158 18.675 13.4346 19.0312 12.0002 19.0312ZM2.46582 12C3.64238 13.3922 7.52832 17.5312 12.0002 17.5312C16.4814 17.5312 20.358 13.3922 21.5346 12C20.358 10.6078 16.4721 6.46875 12.0002 6.46875C7.51894 6.46875 3.64238 10.6078 2.46582 12Z"
                    fill="white"
                  ></path>
                  <path
                    id="Vector_2"
                    d="M12 15.375C10.1391 15.375 8.625 13.8609 8.625 12C8.625 10.1391 10.1391 8.625 12 8.625C13.8609 8.625 15.375 10.1391 15.375 12C15.375 13.8609 13.8609 15.375 12 15.375ZM12 10.125C10.9641 10.125 10.125 10.9641 10.125 12C10.125 13.0359 10.9641 13.875 12 13.875C13.0359 13.875 13.875 13.0359 13.875 12C13.875 10.9641 13.0359 10.125 12 10.125Z"
                    fill="white"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
          <div className="p-2 flex items-center justify-between">
            <h2 className="text-xs font-normal mb-2 mt-2 uppercase">
              {product?.name}
            </h2>
            <div className="flex justify-between items-center mb-2">
              <span
                className="
               text-xs font-normal text-primary"
              >
                ₦{product?.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shoptile;
