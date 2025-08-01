import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { subCategoriesByCategory } from "../../../config";
import { getFilteredProducts } from "../../../store/admin/products-slice";
import { logoutUser } from "../../../store/auth-slice";

const MobileNav = ({ isMobileNav, setIsMobileNav }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openCategory, setOpenCategory] = useState(null);
  let links = [
    { name: "ABOUT", link: "/about" },
    { name: "OUR STORE", link: "/store" },
  ];

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };
  const handleSubcategoryClick = (category, subCategory) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const subCategorySlug = subCategory.label
      .toLowerCase()
      .replace(/\s+/g, "-");

    const filterQuery = {
      category: category,
      sub_category: subCategory.label,
    };

    dispatch(getFilteredProducts(filterQuery))
      .unwrap()
      .then((result) => {
        navigate(`/shop/${categorySlug}/${subCategorySlug}`);
      })
      .catch((error) => {
        const errorMessage =
          typeof error === "string"
            ? error
            : error?.message || "Failed to load products";
        dispatch(
          showSnackbar({
            message: errorMessage,
            anchorOrigin: { vertical: "top", horizontal: "center" },
          })
        );
      });
  };
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/", { replace: true });
  };
  return (
    <div className="px-6 overflow-auto md:hidden">
      <hr className="my-6" />

      <main className="flex flex-col justify-start">
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-3">
            <li>ALL PRODUCTS</li>
            <li>NEW ARRIVALS</li>
            <li>SS23 COLLECTION</li>
            <li>WINTER COLLECION</li>
          </ul>
          <div className=" w-full bg-white">
            <ul className="flex flex-col gap-3">
              {Object.entries(subCategoriesByCategory).map(
                ([category, subCategories]) => (
                  <li key={category}>
                    <div
                      className="flex justify-between items-center capitalize rounded-md hover:bg-gray-100 cursor-pointer text-lg  text-gray-800"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                      {openCategory === category ? (
                        <ChevronUp size={20} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                      )}
                    </div>
                    {openCategory === category && (
                      <ul className="flex flex-col gap-2 pt-2 pb-1">
                        {subCategories.map((subCat) => (
                          <li key={subCat.id}>
                            <Link
                              onClick={() => {
                                setIsMobileNav(false);
                                handleSubcategoryClick(category, subCat);
                              }}
                              className="block py-1  rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                              {subCat.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <hr className="my-6" />

        <div>
          {isAuthenticated && user ? (
            <button
              className="flex items-center cursor-pointer gap-2 text-red-600"
              onClick={handleLogout}
            >
              <LogOut size={10} />
              Logout
            </button>
          ) : (
            <Link to="/login" className=" hover:underline">
              Login
            </Link>
          )}
        </div>

        <hr className="my-6" />

        <div>
          <ul className="flex flex-col gap-3">
            {links.map((item) => (
              <Link
                onClick={() => setIsMobileNav(false)}
                to={item.link}
                key={item.name}
              >
                {item.name}
              </Link>
            ))}
            <li>FAQS</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default MobileNav;
