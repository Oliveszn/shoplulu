import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Navbar from "./components/common/Navbar/navbar";
import Home from "./pages/Home";
import Store from "./pages/Store";
import About from "./pages/About";
import Shop from "./pages/Shop";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </>
  );
}

export default App;
