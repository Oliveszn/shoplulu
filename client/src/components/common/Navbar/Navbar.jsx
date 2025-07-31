import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CurrencyDropdown from "../CurrencyDropdown";
import MuiDrawer from "../../ui/MuiDrawer";
import MobileNav from "./MobileNav";
import { subCategoriesByCategory } from "../../../config";
import CartWrapper from "../../cart/CartWrapper";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../../store/ui/snackbarslice";
import { getFilteredProducts } from "../../../store/admin/products-slice";
import { UserCircle } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);
  const [isMobileNav, setIsMobileNav] = useState(false);
  const { cart, status } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  let links = [
    { name: "SHOP", link: "/#" },
    { name: "ABOUT", link: "/about" },
    { name: "OUR STORE", link: "/store" },
  ];

  // Function to handle subcategory click and navigation
  const handleSubcategoryClick = (category, subCategory) => {
    setIsShopHovered(false);

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
  return (
    <>
      <nav className="w-full sticky z-50 top-0 bg-[#ffffff] shadow-bottom">
        <div className="flex flex-row container mx-auto items-center justify-between py-6 px-2">
          <div className="flex items-center justify-start ">
            <ul className="hidden md:flex flex-row items-center gap-6">
              {links.map((item) => (
                <li key={item.name} className="relative group">
                  {item.name === "SHOP" ? (
                    <div
                      onMouseEnter={() => setIsShopHovered(true)}
                      onMouseLeave={() => setIsShopHovered(false)}
                      className="relative"
                    >
                      <Link
                        to={item.link}
                        key={item.name}
                        className="relative hover:opacity-50"
                      >
                        {item.name}
                      </Link>
                      {isShopHovered && (
                        <div
                          className={`fixed top-0 left-0 bottom-20 w-full transition-all bg-amber-400 duration-500 ease-in-out z-50 transform ${
                            isShopHovered
                              ? "translate-y-5 opacity-100 visible"
                              : "translate-y-0 opacity-0 invisible"
                          }`}
                          style={{ top: "var(--navbar-height, 20px)" }}
                        >
                          <div className="mx-aut relative top-6 p-6 bg-priColor rounded-xl shadow-xl ">
                            <div className="grid grid-cols-[15%_85%] relative z-10">
                              <div>
                                <ul className="space-y-2">
                                  <li>
                                    <Link
                                      to="/shop/men"
                                      className="hover:text-red-600"
                                    >
                                      All products
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/shop/women"
                                      className="hover:text-red-600"
                                    >
                                      New Arrivals
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/shop/women"
                                      className="hover:text-red-600"
                                    >
                                      SS23 Collections
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="/shop/women"
                                      className="hover:text-red-600"
                                    >
                                      Winter Collection
                                    </Link>
                                  </li>
                                </ul>
                              </div>

                              <div className="grid grid-cols-4 justify-start">
                                {Object.entries(subCategoriesByCategory).map(
                                  ([category, subCategories]) => (
                                    <div
                                      key={category}
                                      className="flex flex-col"
                                    >
                                      <h2 className="font-bold mb-2 capitalize">
                                        {category}
                                      </h2>
                                      <ul className="cursor-pointer list-none">
                                        {subCategories.map((subCat) => (
                                          <li
                                            key={subCat.id}
                                            className="capitalize hover:text-red-600 transition-colors duration-200 py-1"
                                            onClick={() =>
                                              handleSubcategoryClick(
                                                category,
                                                subCat
                                              )
                                            }
                                          >
                                            {subCat.label}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Normal link for other items
                    <Link to={item.link} className="hover:opacity-50">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="flex md:hidden">
              <button
                className="cursor-pointer"
                onClick={() => setIsMobileNav(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g id="Frame">
                    <path
                      id="Vector"
                      d="M3 4H21V6H3V4ZM3 11H15V13H3V11ZM3 18H21V20H3V18Z"
                      fill="black"
                    ></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 ">
            <Link to="/">
              <svg width="200" height="60" viewBox="0 0 200 60">
                <rect
                  x="10"
                  y="20"
                  width="20"
                  height="20"
                  rx="2"
                  fill="#6b7280"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                />
                <path
                  d="M15 20 Q15 15 20 15 Q25 15 25 20"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="28" r="1.5" fill="#fbbf24" />

                <text
                  x="45"
                  y="35"
                  fontSize="20"
                  fontWeight="bold"
                  fill="#111"
                  fontFamily="Arial, sans-serif"
                >
                  ShopLulu
                </text>

                <defs>
                  <linearGradient
                    id="horizGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#fdf2f8" />
                    <stop offset="100%" stopColor="#fce7f3" />
                  </linearGradient>
                </defs>
              </svg>
            </Link>
          </div>

          <div className="flex items-center ml-auto justify-end md:gap-6">
            <div>
              <button className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g id="search">
                    <g id="Group">
                      <path
                        id="Vector"
                        d="M7.61169 13.2234C10.7109 13.2234 13.2234 10.7109 13.2234 7.61169C13.2234 4.51244 10.7109 2 7.61169 2C4.51244 2 2 4.51244 2 7.61169C2 10.7109 4.51244 13.2234 7.61169 13.2234Z"
                        stroke="#1A0C0B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        id="Vector_2"
                        d="M11.5143 11.8057L13.7143 14"
                        stroke="#1A0C0B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
            <div>
              <CurrencyDropdown />
            </div>

            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <Link
                  to="/shop/account"
                  className="flex items-center gap-2 text-gray-700 hover:text-black"
                >
                  <UserCircle className="w-6 h-6" />
                </Link>
              ) : (
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-black font-medium"
                >
                  LOGIN
                </Link>
              )}
            </div>

            <div>
              <button
                className="cursor-pointer"
                onClick={() => setIsDrawerOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g id="paper-bag">
                    <g id="Group 28">
                      <path
                        id="Vector"
                        d="M13.013 14.0003H2.89706C2.77032 14.0003 2.66663 13.8966 2.66663 13.7698V4.76144C2.66663 4.6347 2.77032 4.53101 2.89706 4.53101H13.013C13.1397 4.53101 13.2434 4.6347 13.2434 4.76144V13.7698C13.2434 13.8966 13.1397 14.0003 13.013 14.0003ZM3.12749 13.5394H12.7826V4.99187H3.12749V13.5394Z"
                        fill="#1A0C0B"
                        stroke="#1A0C0B"
                        strokeWidth="0.8"
                      ></path>
                      <path
                        id="Vector_2"
                        d="M10.4953 6.83619C10.3609 6.83619 10.2509 6.72622 10.2509 6.5918V4.19272C10.2509 2.88524 9.18782 1.82215 7.88034 1.82215C6.57286 1.82215 5.50977 2.88524 5.50977 4.19272V6.5918C5.50977 6.72622 5.3998 6.83619 5.26538 6.83619C5.13097 6.83619 5.021 6.72622 5.021 6.5918V4.19272C5.021 2.61641 6.30404 1.33337 7.88034 1.33337C9.45665 1.33337 10.7397 2.61641 10.7397 4.19272V6.5918C10.7397 6.72622 10.6297 6.83619 10.4953 6.83619Z"
                        fill="#1A0C0B"
                        stroke="#1A0C0B"
                        strokeWidth="0.8"
                      ></path>
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <MuiDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        anchor="right"
        width="30vw"
      >
        <div className="">
          {status === "loading" ? (
            <div className="flex justify-center items-center">
              <span className="loader" />
            </div>
          ) : cart?.items?.length > 0 ? (
            <>
              <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
              <CartWrapper cart={cart} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <h1 className="uppercase text-center text-sm">
                No products in the cart.
              </h1>
            </div>
          )}
        </div>
      </MuiDrawer>

      {/* Mobile nav */}
      <MuiDrawer
        isOpen={isMobileNav}
        onClose={() => setIsMobileNav(false)}
        anchor="left"
        width="100vw"
      >
        <MobileNav isMobileNav={isMobileNav} setIsMobileNav={setIsMobileNav} />
      </MuiDrawer>
    </>
  );
};

export default Navbar;
