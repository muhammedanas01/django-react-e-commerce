import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import { useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import OrderDetail from "../customer/OrderDetail";

function VendorOrderDetails() {
  const [orderDetail, setOrderDetail] = useState([]);
  const [orderDetailU, setOrderDetailU] = useState([])
  const param = useParams();
  const userData = UserData();
  useEffect(() => {
    apiInstance
      .get(`vendor/order-detail/${param?.order_id}/${userData?.vendor_id}`)
      .then((response) => {
        setOrderDetail(response.data.orderItem);
        setOrderDetailU(response.data)
      });
  }, []);
  console.log(orderDetail);
  return (
    <>
      <main className="mt-5">
        <div className="container-fluid">
          {" "}
          {/* Changed from container to container-fluid */}
          <section className="px-3">
            {" "}
            {/* Added padding for responsiveness */}
            <div className="row">
              <VendorSideBar />
              <div className="col-lg-9 mt-1">
                <main className="mb-5">
                  <div className="px-3">
                    {" "}
                    {/* Reduced extra container to avoid nesting */}
                    <section className="mb-5">
                      <h3 className="mb-3">
                        <i className="fas fa-shopping-cart text-primary" />{" "}
                       {orderDetailU.order_id}
                      </h3>
                      <div className="row gx-2">
                        {" "}
                        {/* Reduced spacing between grid items */}
                        {[
                          {
                            title: "Total",
                            value: orderDetailU.total,
                            bg: "#B2DFDB",
                          },
                          {
                            title: "Payment Status",
                            value: orderDetailU.payment_status,
                            bg: "#D1C4E9",
                          },
                          {
                            title: "Order Status",
                            value: orderDetailU.order_status,
                            bg: "#BBDEFB",
                          },
                          {
                            title: "Shipping Amount",
                            value: orderDetailU.shipping_amount,
                            bg: "#bbfbeb",
                          },
                          {
                            title: "Tax Fee",
                            value: orderDetailU.tax,
                            bg: "#bbf7fb",
                          },
                          {
                            title: "Service Fee",
                            value: orderDetailU.service_fee,
                            bg: "#eebbfb",
                          },
                          {
                            title: "Discount Fee",
                            value: orderDetailU.saved,
                            bg: "#bbc5fb",
                          },
                        ].map((item, index) => (
                          <div key={index} className="col-md-3 col-sm-6 mb-4">
                            <div
                              className="rounded shadow p-3 text-center"
                              style={{ backgroundColor: item.bg }}
                            >
                              <p className="mb-1">{item.title}</p>
                              <h2 className="mb-0">{item.value}</h2>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section className="p-3">
                      <div className="rounded shadow p-3">
                        <div className="col-lg-12">
                          <table className="table align-middle bg-white w-100">
                            <thead className="bg-light">
                              <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orderDetail.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img
                                        src={item.product.image}
                                        style={{
                                          width: "80px",
                                          height: "auto",
                                        }}
                                        alt={item.product.title}
                                      />
                                      <p className="text-muted mb-0 ms-3">
                                        {item.product.title}
                                      </p>
                                    </div>
                                  </td>
                                  <td>${item.price}</td>
                                  <td>{item.item_quantity}</td>
                                  <td>${item.total}</td>
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
        </div>
      </main>
    </>
  );
}

export default VendorOrderDetails;
