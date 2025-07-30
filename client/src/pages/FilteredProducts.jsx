import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredProducts } from "../store/admin/products-slice";
import Shoptile from "../components/shop-view/Shoptile";
import ShoppingBagSpinner from "../components/common/LoadingSpinner";

const FilteredProducts = () => {
  const { category, subCategory } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Get filtered products from Redux store
  const { productList, isLoading } = useSelector(
    (state) => state.adminProducts
  );

  useEffect(() => {
    if (category && subCategory) {
      // Convert URL slugs back to readable format
      const categoryName = category.replace(/-/g, " ");
      const subCategoryName = subCategory.replace(/-/g, " ");

      // Dispatch action to get filtered products
      const filterQuery = {
        category: categoryName,
        sub_category: subCategoryName,
      };

      dispatch(getFilteredProducts(filterQuery))
        .unwrap()
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [category, subCategory, dispatch]);

  const handleBackToShop = () => {
    navigate("/shop");
  };

  if (loading || isLoading) {
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
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {subCategory?.replace(/-/g, " ")}
        </h1>
        <p className="text-gray-600 mt-2 capitalize">
          Browse our collection of {subCategory?.replace(/-/g, " ")} in{" "}
          {category?.replace(/-/g, " ")}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productList && productList.length > 0 ? (
          productList?.map((productItem, i) => (
            <Shoptile product={productItem} key={productItem.product_id || i} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <ShoppingBagSpinner />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No products found
              </h3>
              <div className="mt-6">
                <button
                  onClick={handleBackToShop}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      {productList && productList.length > 0 && (
        <div className="mt-8 text-center text-gray-600">
          Showing {productList.length} product
          {productList.length !== 1 ? "s" : ""} in{" "}
          {subCategory?.replace(/-/g, " ")}
        </div>
      )}
    </div>
  );
};

export default FilteredProducts;
