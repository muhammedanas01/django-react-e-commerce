import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";

import CartID from "../plugin/CartId";
import UserData from "../plugin/UserData";
import useCurrentAddress from "../plugin/UserCountry";

import apiInstance from "../../utils/axios";

import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  timer: 1300,
  timerProgressBar: true,
});

function Cart() {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState([]);
  const [productQuantity, setProductQuantity] = useState({});

  const userData = UserData();
  const cartId = CartID();
  const currentAddress = useCurrentAddress();

  const fetchCartData = (cartId, userId) => {
    const url = userId
      ? `cart-list/${cartId}/${userId}/`
      : `cart-list/${cartId}/`;
    apiInstance.get(url).then((response) => {
      setCart(response.data);
    });
  };

  const fetchCartTotal = (cartId, userId) => {
    const url = userId
      ? `cart-detail/${cartId}/${userId}/`
      : `cart-detail/${cartId}/`;
    apiInstance.get(url).then((response) => {
      setCartTotal(response.data);
    });
  };

  if (cartId !== null || cartId !== undefined) {
    if (userData !== undefined) {
      //with user id
      useEffect(() => {
        fetchCartData(cartId, userData?.user_id);
        fetchCartTotal(cartId, userData?.user_id);
      }, []);
    } else {
      useEffect(() => {
        fetchCartData(cartId, null);
        fetchCartTotal(cartId, null);
      }, []);
    }
  }

  useEffect(() => {
    const initialQuantity = {};
    cart.forEach((c) => {
      initialQuantity[c.product?.id] = c.item_quantity;
    });
    setProductQuantity(initialQuantity);
  }, [cart]);

  const handleQuantityChange = (e, product_id) => {
    const quantity = e.target.value;
    setProductQuantity((prevProductQuantity) => ({
      ...prevProductQuantity,
      [product_id]: quantity,
    }));
  };

  const cartUpdated = async (
    product_id,
    price,
    shipping_amount,
    size,
    color
  ) => {
    const newQty = productQuantity[product_id];
    const formData = new FormData();
    try {
      formData.append("user_id", userData?.user_id);
      formData.append("cart_id", cartId);
      formData.append("product_id", product_id);
      formData.append("price", price);
      formData.append("shipping_amount", shipping_amount);
      formData.append("country", currentAddress.countryName);
      formData.append("size", size);
      formData.append("color", color);
      formData.append("item_quantity", newQty);
      const response = await apiInstance.post(`cart-view/`, formData);

      fetchCartData(cartId, userData?.user_id);
      fetchCartTotal(cartId, userData?.user_id);
      
      Toast.fire({
        icon: "success",
        title: "quantity changed",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {cart && cart.length > 0 ? (
        <main className="mt-5">
          <div className="container">
            <main className="mb-6">
              <div className="container">
                <section>
                  <div className="row gx-lg-5 mb-5">
                    <div className="col-lg-8 mb-4 mb-md-0">
                      <section className="mb-5">
                        {cart &&
                          cart.length > 0 &&
                          cart.map((c, index) => (
                            <div key={index} className="row border-bottom mb-4">
                              <div className="col-md-2 mb-4 mb-md-0">
                                <div
                                  className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                                  data-ripple-color="light"
                                >
                                  <Link
                                    to={`/product-detail/${c.product.slug}/`}
                                  >
                                    <img
                                      src={c.product.image}
                                      className="w-100"
                                      alt="Product"
                                      style={{
                                        height: "100px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  </Link>
                                </div>
                              </div>

                              <div className="col-md-8 mb-4 mb-md-0">
                                <Link to="" className="fw-bold text-dark mb-4">
                                  {c.product.title}
                                </Link>
                                <p className="mb-0">
                                  <span className="text-muted me-2">Size:</span>
                                  <span>{c.size || "N/A"}</span>
                                </p>
                                <p className="mb-0">
                                  <span className="text-muted me-2">
                                    Color:
                                  </span>
                                  <span>{c.color || "N/A"}</span>
                                </p>
                                <p className="mb-0">
                                  <span className="text-muted me-2">
                                    Price:
                                  </span>
                                  <span>{`$${c.price || 0.0}`}</span>
                                </p>
                                <p className="mb-0">
                                  <span className="text-muted me-2">
                                    Stock Qty:
                                  </span>
                                  <span>
                                    {c.product.stock_quantity || "N/A"}
                                  </span>
                                </p>
                                <p className="mb-0">
                                  <span className="text-muted me-2">
                                    Vendor:{c.tax}
                                  </span>
                                  <span>
                                    {c.product.vendor.name || "Unknown"}
                                  </span>
                                </p>
                                <p className="mt-3">
                                  <button className="btn btn-danger">
                                    <small>
                                      <i className="fas fa-trash me-2" /> Remove
                                    </small>
                                  </button>
                                </p>
                              </div>

                              <div className="col-md-2 mb-4 mb-md-0">
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="form-outline">
                                    <input
                                      type="number"
                                      id="typeNumber"
                                      className="form-control"
                                      value={productQuantity[c.product.id]}
                                      min={1}
                                      onChange={(e) =>
                                        handleQuantityChange(e, c.product.id)
                                      }
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      cartUpdated(
                                        c.product.id,
                                        c.product.price,
                                        c.product.shipping_amount,
                                        c.color,
                                        c.size
                                      )
                                    }
                                    className="ms-2 btn btn-primary"
                                  >
                                    <i className="fas fa-rotate-right"></i>
                                  </button>
                                </div>
                                <p className="text-dark ms-2 mt-3">
                                  <small>Sub Total:</small>
                                </p>
                                <h5 className="mb-2 text-center">
                                  <span>{`AED ${c.sub_total || 0.0}`}</span>
                                </h5>
                              </div>
                            </div>
                          ))}
                      </section>

                      {/* Personal Information */}
                      <div>
                        <h5 className="mb-4 mt-4">Personal Information</h5>
                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="fullName">
                                <i className="fas fa-user"></i> Full Name
                              </label>
                              <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="email">
                                <i className="fas fa-envelope"></i> Email
                              </label>
                              <input
                                type="text"
                                id="email"
                                className="form-control"
                                name="email"
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="mobile">
                                <i className="fas fa-phone"></i> Mobile
                              </label>
                              <input
                                type="text"
                                id="mobile"
                                className="form-control"
                                name="mobile"
                              />
                            </div>
                          </div>
                        </div>

                        <h5 className="mb-1 mt-4">Shipping Address</h5>
                        <div className="row mb-4">
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="address">
                                Address
                              </label>
                              <input
                                type="text"
                                id="address"
                                className="form-control"
                                name="address"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="city">
                                City
                              </label>
                              <input
                                type="text"
                                id="city"
                                className="form-control"
                                name="city"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="state">
                                State
                              </label>
                              <input
                                type="text"
                                id="state"
                                className="form-control"
                                name="state"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="landmark">
                                Landmark
                              </label>
                              <input
                                type="text"
                                id="landmark"
                                className="form-control"
                                name="landmark"
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label
                                className="form-label"
                                htmlFor="postalCode"
                              >
                                Postal Code
                              </label>
                              <input
                                type="text"
                                id="postalCode"
                                className="form-control"
                                name="postalCode"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 mt-3">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="country">
                                Country
                              </label>
                              <input
                                type="text"
                                id="country"
                                className="form-control"
                                name="country"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary Section */}

                    <div className="col-lg-4 mb-4 mb-md-0">
                      <section className="shadow-4 p-4 rounded-5 mb-4">
                        <h5 className="mb-3">Cart Summary</h5>
                        <div className="d-flex justify-content-between mb-3">
                          <span>Sub Total</span>
                          <span>AED {cartTotal.sub_total?.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Shipping</span>
                          <span>AED {cartTotal.shipping?.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Tax</span>
                          <span>AED {cartTotal.tax?.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Service Fee</span>
                          <span>AED {cartTotal.service_fee?.toFixed(2)}</span>
                        </div>
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between fw-bold mb-5">
                          <span>Grand Total</span>
                          <span>AED {cartTotal.total?.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary btn-rounded w-100">
                          Go to Checkout
                        </button>
                        <div className="card p-3 mt-4">
                          <label htmlFor="couponCode" className="form-label">
                            Apply Coupon Code
                          </label>
                          <div className="d-flex">
                            <input
                              type="text"
                              id="couponCode"
                              className="form-control me-2"
                              placeholder="Enter coupon code"
                            />
                            <button className="btn btn-success">Apply</button>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </main>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "51vh",
            textAlign: "center",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <i className="fa fa-cart-arrow-down fa-10x"></i>
            <h3>Oops! Cart is empty. Click to continue shopping.</h3>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Cart;