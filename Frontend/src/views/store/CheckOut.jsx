import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

import apiInstance from "../../utils/axios";
import { SERVER_URL, PAYPAL_CLIENT_ID } from "../../utils/constants";

import Swal from "sweetalert2";

const initialOptions = {
  clientId: "test",
  currency: "USD",
  intent: "capture",
};

function CheckOut() {
  const [order, setOrder] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const param = useParams();

  const fetchOrderData = () => {
    apiInstance.get(`checkout/${param.order_id}/`).then((response) => {
      console.log(response.data);
      setOrder(response.data);
    });
  };

  //When the user navigates to this component, the useEffect will run and call the API endpoint for checkout with order_id
  useEffect(() => {
    fetchOrderData();
  }, []);

  const applyCoupen = async () => {
    const formData = new FormData();
    formData.append("order_id", order.order_id);
    formData.append("coupon_code", couponCode);
    try {
      const response = await apiInstance.post("coupon/", formData);
      fetchOrderData();
      console.log(response.data.message);
      Swal.fire({
        icon: response.data.icon,
        title: response.data.message,
      });
    } catch (error) {
      Swal.fire({
        icon: error.response?.data?.icon || "error",
        title: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const payWithStripe = (e) => {
    setPaymentLoading(true);
    e.target.form.submit();
  };

  // const initialOptions = {
  //   clientId: PAYPAL_CLIENT_ID,
  //   currency:"AED",
  //   intent:"capture",

  // }

  return (
    <div>
      <main>
        <main className="mb-4 mt-4">
          <div className="container">
            <section className="">
              <div className="row gx-lg-5">
                <div className="col-lg-8 mb-4 mb-md-0">
                  <section className="">
                    <div className="alert alert-warning">
                      <strong>Review Your Shipping &amp; Order Details </strong>
                    </div>
                    <form>
                      <h5 className="mb-4 mt-4">Shipping address</h5>
                      <div className="row mb-4">
                        <div className="col-lg-12">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Full Name
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.full_name}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Email
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.email}
                            />
                          </div>
                        </div>

                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Mobile
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.mobile}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Address
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.address}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              City
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.city}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Landmark
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.landmark}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              State
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.state}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Postal Code
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.postal_code}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 mt-4">
                          <div className="form-outline">
                            <label
                              className="form-label"
                              htmlFor="form6Example2"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              readOnly
                              className="form-control"
                              value={order.country}
                            />
                          </div>
                        </div>
                      </div>

                      <h5 className="mb-4 mt-4">Billing address</h5>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          defaultValue=""
                          id="form6Example8"
                          defaultChecked=""
                        />
                        <label
                          className="form-check-label"
                          htmlFor="form6Example8"
                        >
                          Same as shipping address
                        </label>
                      </div>
                    </form>
                  </section>
                  {/* Section: Biling details */}
                </div>
                <div className="col-lg-4 mb-4 mb-md-0">
                  {/* Section: Summary */}
                  <section className="shadow-4 p-4 rounded-5 mb-4">
                    <h5 className="mb-3">Order Summary</h5>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Subtotal </span>
                      <span>AED {order.sub_total}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Shipping </span>
                      <span>AED {order.shipping_amount}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>VAT</span>
                      <span>AED {order.tax}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Servive Fee</span>
                      <span>AED {order.service_fee}</span>
                    </div>

                    {Number(order.saved) > 0 && (
                      <div className="d-flex text-danger fw-bold justify-content-between">
                        <span>Discount</span>
                        <span>AED -{order.saved}</span>
                      </div>
                    )}

                    <hr className="my-4" />
                    <div className="d-flex justify-content-between fw-bold mb-5">
                      <span>Total </span>
                      <span>AED {order.total}</span>
                    </div>

                    <div className="shadow p-3 d-flex mt-4 mb-4">
                      <input
                        onChange={(e) => setCouponCode(e.target.value)}
                        name="couponCode"
                        type="text"
                        className="form-control"
                        style={{ border: "dashed 1px gray" }}
                        placeholder="Enter Coupon Code"
                        id=""
                      />
                      <button
                        onClick={applyCoupen}
                        className="btn btn-success ms-1"
                      >
                        <i className="fas fa-check-circle"></i>
                      </button>
                    </div>

                    {paymentLoading === true && (
                      <form
                        action={`${SERVER_URL}/api/v1/stripe-checkout/${order.order_id}/`}
                        method="POST"
                      >
                        <button
                          type="submit"
                          className="btn btn-primary btn-rounded w-100 mt-2"
                          style={{ backgroundColor: "#635BFF" }}
                          onClick={payWithStripe}
                          disabled
                        >
                          processing..{" "}
                          <i className="fas fa-spinner fa-spin"> </i>
                        </button>
                      </form>
                    )}

                    {paymentLoading === false && (
                      <form
                        action={`${SERVER_URL}/api/v1/stripe-checkout/${order.order_id}/`}
                        method="POST"
                      >
                        <button
                          type="submit"
                          className="btn btn-primary btn-rounded w-100 mt-2"
                          style={{ backgroundColor: "#635BFF" }}
                          onClick={payWithStripe}
                        >
                          pay with stripe{" "}
                          <i className="fas fa-credit-card"> </i>
                        </button>
                      </form>
                    )}
                    {console.log(order.total)}

                    <PayPalScriptProvider options={initialOptions}>
                      <PayPalButtons
                        className="mt-3"
                        createOrder={(data, actions) => {
                          return actions.order.create({
                            purchase_units: [
                              {
                                amount: {
                                  currency_code: "USD",
                                  value: 100045 // Ensures exactly two decimal places
                                  // Add fallback for undefined total
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                            const name = details.payer.name.given_name;
                            const status = details.status;
                            const paypal_order_id = data.orderID;

                            console.log(status);
                            if (status === "COMPLETED") {
                              navigate(
                                `/payment-success/${order.oid}/?paypal_order_id=${paypal_order_id}`
                              );
                            }
                          });
                        }}
                      />
                    </PayPalScriptProvider>

                    {/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
                  </section>
                </div>
              </div>
            </section>
          </div>
        </main>
      </main>
    </div>
  );
}

export default CheckOut;
