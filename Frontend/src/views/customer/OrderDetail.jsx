import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";

import UserData from "../plugin/UserData";

import moment from "moment";

function OrderDetail() {
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);

  const userData = UserData();
  const param = useParams();

  useEffect(() => {
    apiInstance
      .get(`customer/order/${userData?.user_id}/${param.order_id}/`)
      .then((response) => {
        setOrder(response.data);
        const selectedOrder = response.data.find(order => order.order_id === param.order_id);
        if (selectedOrder) {
          setOrderItems(selectedOrder.orderItem); // Set orderItems for the selected order
        } else {
          setOrderItems([]); // If no matching order, clear orderItems
        }      
      });
  }, []);

  console.log(order)  

  return (
    <>
      <main className="mt-5">
        <div className="container">
          <section className="">
            <div className="row">
              <SideBar />

              <div className="col-lg-9 mt-1">
                <main className="mb-5">
                  {/* Container for demo purpose */}
                  <div className="container px-4">
                    {/* Section: Summary */}
                    <section className="mb-5">
                      <h3 className="mb-3">
                        {" "}
                        <i className="fas fa-shopping-cart text-primary" />{" "}
                        {order[0]?.order_id}{" "}
                      </h3>
                      <div className="row gx-xl-5">
                        <div className="col-lg-3 mb-4 mb-lg-0">
                          <div
                            className="rounded shadow"
                            style={{ backgroundColor: "#B2DFDB" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="">
                                  <p className="mb-1">Total</p>
                                  <h2 className="mb-0">
                                    {order[0]?.total}{" "}
                                    <span
                                      className=""
                                      style={{ fontSize: "0.875rem" }}
                                    ></span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                          <div
                            className="rounded shadow"
                            style={{ backgroundColor: "#D1C4E9" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="">
                                  <p className="mb-1">Payment Status</p>
                                  <h2 className="mb-0">
                                    {order[0]?.payment_status.toUpperCase()}
                                    <span
                                      className=""
                                      style={{ fontSize: "0.875rem" }}
                                    ></span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                          <div
                            className="rounded shadow"
                            style={{ backgroundColor: "#BBDEFB" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="">
                                  <p className="mb-1">Order Status</p>
                                  <h2 className="mb-0">
                                    {order[0]?.order_status.toUpperCase()}
                                    <span
                                      className=""
                                      style={{ fontSize: "0.875rem" }}
                                    ></span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0">
                          <div
                            className="rounded shadow"
                            style={{ backgroundColor: "#bbfbeb" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="">
                                  <p className="mb-1">Shipping Amount</p>
                                  <h2 className="mb-0">
                                    {order[0]?.shipping_amount}
                                    <span
                                      className=""
                                      style={{ fontSize: "0.875rem" }}
                                    ></span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 mb-4 mb-lg-0 mt-5">
                          <div
                            className="rounded shadow"
                            style={{ backgroundColor: "#bbf7fb" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="">
                                  <p className="mb-1">Tax Fee</p>
                                  <h2 className="mb-0">
                                    {order[0]?.tax}
                                    <span
                                      className=""
                                      style={{ fontSize: "0.875rem" }}
                                    ></span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 mb-4 mb-lg-0 mt-5">
                          <div
                            className="rounded shadow"
                            style={{ backgroundColor: "#eebbfb" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="">
                                  <p className="mb-1">Service Fee</p>
                                  <h2 className="mb-0">
                                    {order[0]?.service_fee}
                                    <span
                                      className=""
                                      style={{ fontSize: "0.875rem" }}
                                    ></span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 mb-4 mb-lg-0 mt-5">
                          <div
                            className="rounded shadow"
                            style={{ backgroundColor: "#bbc5fb" }}
                          >
                            <div className="card-body">
                              <div className="d-flex align-items-center">
                                <div className="">
                                  <p className="mb-1">Discount Fee</p>
                                  <h2 className="mb-0">
                                    {order[0]?.saved}
                                    <span
                                      className=""
                                      style={{ fontSize: "0.875rem" }}
                                    ></span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    {/* Section: Summary */}
                    {/* Section: MSC */}
                    <section className="">
                      <div className="row rounded shadow p-3">
                        <div className="col-lg-12 mb-4 mb-lg-0">
                          <table className="table align-middle mb-0 bg-white">
                            <thead className="bg-light">
                              <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Size</th>
                                <th>Color</th>
                                <th>Quantity</th>
                                <th>SubTotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderItems?.map((item, index) => (
                                <tr>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={item.product.image}
                                        style={{ width: 80 ,marginRight: '10px' }} 
                                        alt=""
                                      />
                                      {"    "}
                                      <p className="text-muted mb-0">
                                        {moment(item.date).format("MMM d, yyyy")}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <p className="fw-normal mb-1">{item.product.price}</p>
                                  </td>
                                  <td>
                                    <p className="fw-normal mb-1">{item.size}</p>
                                  </td>
                                  <td>
                                    <p className="fw-normal mb-1">{item.color.toLowerCase()}</p>
                                  </td>
                                  <td>
                                    <p className="fw-normal mb-1">{item.item_quantity}</p>
                                  </td>
                                  <td>
                                    <span className="fw-normal mb-1">
                                      {item.sub_total}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>
                  </div>
                </main>
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </>
  );
}

export default OrderDetail;
