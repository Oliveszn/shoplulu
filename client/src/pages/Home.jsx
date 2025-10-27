import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";
import bannerOne from "../../public/images/about.jpg";
import { HeadProvider, Title, Meta } from "react-head";

const Home = () => {
  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  return (
    <div className="px-4 pb-12 bg-gray-50">
      <HeadProvider>
        <Title>Shoplulu - Home</Title>
        <Meta name="description" content="Luxury fashion at Shoplulu" />
      </HeadProvider>
      <div className="-mx-4 pb-10 min-h-screen">
        <img src={bannerOne} alt="" className="storeimg" />
      </div>
      <div className="mx-auto container">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10">
          {productList?.map((productItem, i) => (
            <Shoptile product={productItem} key={productItem.product_id || i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
