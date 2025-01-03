import { useState } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Navigate, Link } from "react-router-dom";
import React, { useEffect } from "react";

import { useAuthStore } from "./store/auth";

import mainWrapper from "./layout/mainWrapper";

import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";

import Login from "./views/auth/Login";
import Homee from "./views/auth/Homee";
import Register from "./views/auth/Register";
import Logout from "./views/auth/Logout";
import Password from "./views/auth/Password"; // requesting for reseting pass
import CreatePassword from "./views/auth/CreatePassword"; // request accepted and change password

import Products from "./views/store/Products";
import ProductDetails from "./views/store/ProductDetails";
import Cart from "./views/store/Cart";
import CheckOut from "./views/store/CheckOut";
import PaymentSuccess from "./views/store/PaymentSuccess";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return (
    <BrowserRouter>
      <StoreHeader />
      <Routes>
        <Route path="/home" element={<Homee />} />
        {/* for authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forget-password-reset" element={<Password />} />
        <Route path="/create-new-password" element={<CreatePassword />} />
        {/* for store */}
        <Route path="/" element={<Products />} />
        <Route path="/product-detail/:slug/" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/:order_id/" element={<CheckOut />} />
        <Route path="/payment-success/:order_id/" element={<PaymentSuccess />} />


      </Routes>
      <StoreFooter />
    </BrowserRouter>
  );
}

export default App;
