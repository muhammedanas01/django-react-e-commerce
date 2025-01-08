import { useState, useEffect } from "react";

import apiInstance from "../../utils/axios";

import { useParams } from "react-router-dom";

function PaymentSuccess() {
  const [order, setOrder] = useState([]);
  const [status, setStatus] = useState("Verifying");

  const param = useParams();

  const urlParam = new URLSearchParams(window.location.search);
  const sessionId = urlParam.get("session_id");

  useEffect(() => {
    apiInstance.get(`checkout/${param.order_id}`).then((response) => {
      setOrder(response.data);
    });
  }, [param]);

  useEffect(() => {
    if (order.order_id && sessionId) {
      const formData = new FormData();
      formData.append("order_id", order.order_id);
      formData.append("session_id", sessionId);

      setStatus("Verifying");

      apiInstance
        .post(`payment-success/${order.order_id}/`, formData) //Payment Received
        .then((response) => {
          if (response.data.message === "Payment Successfull") {
            setStatus("PaymentSuccessfull");
          }
          if (response.data.message === "Payment Already Received") {
            setStatus("Payment Already Received");
          }
          if (response.data.message === "unpaid") {
            setStatus("unpaid");
          }
        })
        .catch((error) => {
          if (response.data === "An Error Occured, Try Again") {
            setStatus("ErrorOccured");
          }
        });
    }
  }, [order.order_id, sessionId]);
  console.log(status)

  return (
    <>
      <div>
        <main className="mb-4 mt-4 h-100">
          <div className="container">
            {/* Section: Checkout form */}
            <section className="">
              <div className="gx-lg-5">
                <div className="row pb50"></div>
                <div className="row">
                  <div className="col-xl-12">
                    <div className="application_statics">
                      <div className="account_user_deails dashboard_page">
                        <div className="d-flex justify-content-center align-items-center">
                          {status === "Verifying" && (
                            <div className="col-lg-12">
                              <div className="border border-3 border-success" />
                              <div className="card bg-white shadow p-5">
                                <div className="mb-4 text-center">
                                  <i
                                    className="fas fa-spinner fa-spin text-warning"
                                    style={{ fontSize: 100, color: "green" }}
                                  />
                                </div>
                                <div className="text-center">
                                  <h1>
                                    Payment Verifying{" "}
                                    
                                  </h1>
                                  <p className="text-success">
                                    Please hold on while we verify your payment
                                    <br />
                                    <b className="text-danger">
                                      NOTE: Do not reload or leave the page
                                    </b>
                                    <br />
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {status === "PaymentSuccessfull" && (
                            <div className="col-lg-12">
                              <div className="border border-3 border-success" />
                              <div className="card bg-white shadow p-5">
                                <div className="mb-4 text-center">
                                  <i
                                    className="fas fa-check-circle text-success"
                                    style={{ fontSize: 100, color: "green" }}
                                  />
                                </div>
                                <div className="text-center">
                                  <h1>Thank You !</h1>
                                  <p>
                                    Thank you for your purchase! Your order
                                    details have been emailed to{" "}
                                    <b>{order.email}</b>. Please note your order
                                    ID for reference <b>{order.order_id}</b>
                                  </p>
                                  <button
                                    className="btn btn-success mt-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                  >
                                    View Order <i className="fas fa-eye" />{" "}
                                  </button>
                                  <a
                                    href="/"
                                    className="btn btn-primary mt-3 ms-2"
                                  >
                                    Download Invoice{" "}
                                    <i className="fas fa-file-invoice" />{" "}
                                  </a>
                                  <a className="btn btn-secondary mt-3 ms-2">
                                    Go Home{" "}
                                    <i className="fas fa-fa-arrow-left" />{" "}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {status === "Payment Already Received" && (
                            <div className="col-lg-12">
                              <div className="border border-3 border-success" />
                              <div className="card bg-white shadow p-5">
                                <div className="mb-4 text-center">
                                  <i
                                    className="fas fa-check-circle text-success"
                                    style={{ fontSize: 100, color: "green" }}
                                  />
                                </div>
                                <div className="text-center">
                                  <h1>Transaction Already Completed</h1>
                                  <p>
                                    "Your payment has already been confirmed!
                                    The details of your order have been sent to
                                    your email at <b>{order.email}</b>
                                    <br /> Please note your order ID for
                                    reference <b>{order.order_id}</b>
                                  </p>
                                  <button
                                    className="btn btn-success mt-3"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                  >
                                    View Order <i className="fas fa-eye" />{" "}
                                  </button>
                                  <a
                                    href="/"
                                    className="btn btn-primary mt-3 ms-2"
                                  >
                                    Download Invoice{" "}
                                    <i className="fas fa-file-invoice" />{" "}
                                  </a>
                                  <a className="btn btn-secondary mt-3 ms-2">
                                    Go Home{" "}
                                    <i className="fas fa-fa-arrow-left" />{" "}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {status === "unpaid" && (
                            <div className="col-lg-12">
                              <div className="border border-3 border-success" />
                              <div className="card bg-white shadow p-5">
                                <div className="mb-4 text-center">
                                  <i
                                    className="fas fa-exclamation-circle text-warning"
                                    style={{ fontSize: 100, color: "green" }}
                                  />
                                </div>
                                <div className="text-center">
                                  <h1>
                                    Payment Not Received{" "}
                                    <i className="fas fa-spinner fa-spin"></i>
                                  </h1>
                                  <p className="text-success">
                                    We couldn't verify your payment at this
                                    time. Please ensure your transaction is
                                    complete, or contact support for assistance.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {status === "ErrorOccured" && (
                            <div className="col-lg-12">
                              <div className="border border-3 border-success" />
                              <div className="card bg-white shadow p-5">
                                <div className="mb-4 text-center">
                                  <i
                                    className="fas fa-exclamation-circle text-warning"
                                    style={{ fontSize: 100, color: "green" }}
                                  />
                                </div>
                                <div className="text-center">
                                  <h1>
                                    Oops! An Error Occurred, Try again{" "}
                                    <i className="fas fa-spinner fa-spin"></i>
                                  </h1>
                                  <p className="text-success">
                                    We couldn't verify your payment at this
                                    time. Please ensure your transaction is
                                    complete, or contact support for assistance.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Order Summary
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="modal-body text-start text-black p-1">
                  <h5
                    className="modal-title text-uppercase "
                    id="exampleModalLabel"
                  >
                    {order.full_name}
                  </h5>
                  <h6>{order.email}</h6>
                  <h6 className="mb-1">{order.mobile}</h6>
                  <h6 className="mb-1">
                    {order.address},{order.state},{order.country}
                  </h6>

                  <p className="mb-0" style={{ color: "#35558a" }}>
                    Payment summary
                  </p>
                  <hr
                    className="mt-2 mb-4"
                    style={{
                      height: 0,
                      backgroundColor: "transparent",
                      opacity: ".75",
                      borderTop: "2px dashed #9e9e9e",
                    }}
                  />
                  {order.orderItem?.map((o, index) => (
                    <div className="d-flex justify-content-between shadow p-2 rounded-2 mb-2">
                      <div>
                        <p className="fw-bold mb-0">{o.product?.title}</p>
                        <p className="text-muted mb-0">
                          Quantity: {o.item_quantity}
                        </p>
                        <p className="text-muted mb-0">
                          Subtotal: {o.sub_total}
                        </p>
                      </div>
                      <p className="text-muted mb-0">AED {o.price}</p>
                    </div>
                  ))}
                  <div className="d-flex justify-content-between">
                    <p className="fw-bold mb-0">Subtotal</p>
                    <p className="small mb-0">AED {order.sub_total}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small mb-0">Shipping Fee</p>
                    <p className="small mb-0">AED {order.shipping_amount}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small mb-0">Service Fee</p>
                    <p className="small mb-0">AED {order.service_fee}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small mb-0">Tax</p>
                    <p className="small mb-0">AED {order.tax}</p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <p className="small mb-0">Discount</p>
                    <p className="small mb-0">-$10.00</p>
                  </div>
                  <div className="d-flex justify-content-between mt-4">
                    <p className="fw-bold">Total</p>
                    <p className="fw-bold" style={{ color: "#35558a" }}>
                      AED {order.total}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccess;
