import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navbar from "./components/common/Navbar/navbar";
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/store" element={<Store />} />
        <Route path="/product" element={<ProductDetails />} />

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
          {/* <Route path="thinking" element={<AdminThinking />} /> */}
          {/* <Route path="news" element={<AdminNews />} /> */}
          {/* <Route path="contacts" element={<AdminContacts />} /> */}
          {/* <Route path="about" element={<AdminAbout />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
