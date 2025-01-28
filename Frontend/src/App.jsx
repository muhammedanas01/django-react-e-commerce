import { useState } from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Navigate, Link } from "react-router-dom";
import React, { useEffect } from "react";

import { useAuthStore } from "./store/auth";



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
import SearchProduct from "./views/store/SearchProduct";

import Account from "./views/customer/Account";
import Orders from "./views/customer/Orders";

import PrivateRouter from "./layout/PrivateRouter";

import { CartContext } from "./views/plugin/Context";

import CartID from "./views/plugin/CartId";
import UserData from "./views/plugin/UserData";
import useCurrentAddress from "./views/plugin/UserCountry";

import apiInstance from "./utils/axios";

import MainWrapper from "./layout/mainWrapper";
import OrderDetail from "./views/customer/OrderDetail";
import WishList from "./views/customer/WishList";
import CustomerNotification from "./views/customer/CustomerNotification";

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  const [count, setCount] = useState(0);
  const [cartCount, setCartCount] = useState("");

  const userData = UserData();
  const cartId = CartID();
  //const currentAddress = useCurrentAddress();

  useEffect(() => {
    const url = userData
      ? `cart-list/${cartId}/${userData?.user_id}/`
      : `cart-list/${cartId}/`;
    apiInstance.get(url).then((response) => {
      setCartCount(response.data.length);
    });
  });

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      <BrowserRouter>
        <StoreHeader />
        <MainWrapper>
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
          <Route path="/payment-success/:order_id/"element={<PaymentSuccess />}/>
          <Route path="/search" element={<SearchProduct />} />

          {/* customer */}
          <Route path="customer/account" element={<PrivateRouter> <Account /> </PrivateRouter>} />
          <Route path="customer/orders" element={<PrivateRouter> <Orders /> </PrivateRouter>} />
          <Route path="customer/order/:order_id" element={<PrivateRouter> <OrderDetail /> </PrivateRouter>} />
          <Route path="customer/wishlist/" element={<PrivateRouter> <WishList /> </PrivateRouter>} />
          <Route path="customer/notifications/" element={<PrivateRouter> <CustomerNotification /> </PrivateRouter>} />


        </Routes>

        </MainWrapper>
        

        <StoreFooter />
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App;
