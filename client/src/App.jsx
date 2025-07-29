import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Home from "./pages/Home";
import Store from "./pages/Store";
import About from "./pages/About";
import Shop from "./pages/Shop";
import AuthLogin from "./pages/auth/Login";
import { Route, Routes, useLocation } from "react-router-dom";
import CheckAuth from "./components/common/CheckAuth";
import { useDispatch, useSelector } from "react-redux";
import AuthLayout from "./components/auth/Layout";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminLayout from "./components/admin-view/AdminLayout";
import { checkAuth } from "./store/auth-slice";
import AdminProducts from "./pages/admin-view/Products";
import ProductDetails from "./pages/ProductDetails";
import { fetchCartItems, fetchGuestCartItems } from "./store/cart-slice";
import MuiSnackbar from "./components/ui/MuiSnackbar";
import Checkout from "./pages/Checkout";
import UserAccount from "./pages/UserAccount";
import NotFound from "./pages/notfound";
import AdminOrders from "./pages/admin-view/Orders";
import PaypalReturnPage from "./pages/PaypalReturn";
import PaypalSuccessPage from "./pages/PaypalSucess";
import PaypalFailed from "./pages/PaypalFailed";
import PayPalCancelPage from "./pages/PaypalCancelled";
import Navbar from "./components/common/Navbar/Navbar";
import FilteredProducts from "./pages/FilteredProducts";

function App() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  ////////keeps me looged in as admin when i refresh or leave page
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      // Authenticated user
      dispatch(fetchCartItems(user.id));
    } else {
      // Guest user
      const guestId = localStorage.getItem("guestId");
      if (guestId) {
        dispatch(fetchGuestCartItems(guestId));
      }
    }
  }, [user?.id, dispatch]);

  return (
    <>
      <Navbar />
      <MuiSnackbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/store" element={<Store />} />

        <Route path="/shop/*" element={<Shop />} />
        <Route
          path="/shop/:category/:subCategory"
          element={<FilteredProducts />}
        />
        <Route path="/shop/product/:slug/:id" element={<ProductDetails />} />
        <Route path="/shop/checkout" element={<Checkout />} />
        <Route path="/shop/account" element={<UserAccount />} />
        <Route path="/shop/paypal-return" element={<PaypalReturnPage />} />
        <Route path="/shop/paypal-cancel" element={<PayPalCancelPage />} />
        <Route path="/shop/payment-success" element={<PaypalSuccessPage />} />
        <Route path="/shop/payment-failed" element={<PaypalFailed />} />

        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          {/* <Route path="register" element={<AuthRegister />} /> */}
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          {/* <Route path="news" element={<AdminNews />} /> */}
          {/* <Route path="contacts" element={<AdminContacts />} /> */}
          {/* <Route path="about" element={<AdminAbout />} /> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
