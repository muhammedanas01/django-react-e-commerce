import React from "react";
import "../Style/CustomerInvoice.css";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import apiInstance from "../../utils/axios";

import UserData from "../plugin/UserData";

import SideBar from "./SideBar";

import moment from "moment";

function CustomerInvoice() {
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);

  const userData = UserData();
  const param = useParams();

  useEffect(() => {
    apiInstance
      .get(`customer/order/${userData?.user_id}/${param.order_id}/`)
      .then((response) => {
        // Log the response to check the structure
        // Find the specific order by order_id
        const selectedOrder = response.data.find(
          (order) => order.order_id === param.order_id
        );

        if (selectedOrder) {
          setOrder(selectedOrder); // Set the order data
          setOrderItems(selectedOrder.orderItem || []); // Set orderItems from the selected order
        } else {
          setOrderItems([]); // Clear orderItems if no matching order found
        }
      })
      .catch((error) => console.error("Error fetching order data:", error));
  }, [userData?.user_id, param.order_id]); // Dependency on user_id and order_id

  useEffect(() => {
    console.log(orderItems); // Log the orderItems array
  }, [orderItems]);
  return (
    <>
      <div>
        <>
          <div className="row d-flex justify-content-center p-2">
            <div className="receipt-main col-xs-10 col-sm-10 col-md-6 col-xs-offset-1 col-sm-offset-1 col-md-offset-3">
              <div className="d-flex justify-content-between">
                <div className="row">
                  <div className="receipt-header">
                    <div className="col-xs-6 col-sm-6 col-md-6">
                      <div className="receipt-left">
                        <img
                          className="img-responsive"
                          alt="iamgurdeeposahan"
                          src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
                          style={{ width: 71, borderRadius: 43 }}
                        />
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 text-left">
                      <div className="receipt-right">
                        <h5 className="margin-top-10">
                          Desphixs<span className="text-warning">.</span>
                        </h5>
                        <p>
                          <i className="fa fa-phone" /> +1 3649-6589
                        </p>
                        <p>
                          <i className="fa fa-envelope" /> company@gmail.com
                        </p>
                        <p>
                          <i className="fa fa-location-arrow" /> 123 Main Street
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="receipt-header receipt-header-mid">
                    <div className="col-xs-12 col-sm-12 col-md-12 text-left">
                      <div className="receipt-right">
                        <h5>Customer Details</h5>
                        <p>
                          <b>
                            <i className="fa fa-user" />
                          </b>
                          {order?.full_name}{" "}
                        </p>
                        <p>
                          <b>
                            <i className="fa fa-envelope" />
                          </b>{" "}
                          {order?.email}{" "}
                        </p>
                        <p>
                          <b>
                            <i className="fa fa-phone" />
                          </b>{" "}
                          {order?.mobile}{" "}
                        </p>
                      </div>
                    </div>
                    <br />
                    <div className="col-xs-12 col-sm-12 col-md-12">
                      <div className="receipt-left">
                       {/* order invoice id */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Sub Total</th>
                      <th>Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems?.map((item, index) => (
                      <tr key={index}>
                        <td className="col-md-5">
                          <p className="fw-normal mb-1">{item.product?.name}</p>{" "}
                          anas
                        </td>
                        <td>
                          <p className="fw-normal mb-1">
                            {item.product?.price}
                          </p>
                        </td>
                        <td>
                          <p className="fw-normal mb-1">{item.item_quantity}</p>
                        </td>
                        <td>
                          <p className="fw-normal mb-1">
                            {item.sub_total}
                          </p>{" "}
                          {/* Ensure color exists */}
                        </td>
                        <td>
                          <p className="fw-normal mb-1">
                            {item.saved}
                          </p>{" "}
                          {/* Ensure color exists */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-start"></div>
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-end">
                    <div className="receipt-right">
                      <h5>Summary</h5>
                      <p className="mb-2">
                        <b>Sub Total: </b>
                        {order?.sub_total}{" "}
                      </p>
                      <p className="mb-2">
                        <b>Shipping: </b>
                        {order?.shipping_amount}{" "}
                      </p>
                      <p className="mb-2">
                        <b>Tax: </b>
                        {order?.tax}{" "}
                      </p>
                      <p className="mb-2">
                        <b>Service Fee: </b>
                        {order?.service_fee}{" "}
                      </p>
                      <br />
                      <p className="mb-2">
                        <b>Total: </b>
                        {order?.total}{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-center align-items-center">
                <button id="printButton" className="btn btn-dark">
                  Print <i className="fas fa-print" />
                </button>
              </div>
            </div>
          </div>
          {/* Print Windows */}
        </>
      </div>
    </>
  );
}

export default CustomerInvoice;
