import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";

function VendorOrders() {
  const [orders, setOrders] = useState([]);
  const userData = UserData();
  useEffect(() => {
    apiInstance.get(`vendor/order/${userData?.vendor_id}`).then((response) => {
      setOrders(response.data);
    });
  }, []);
  console.log(orders);
  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <VendorSideBar />

        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3 container">
            <div className="col-lg-12" style={{ marginBottom: 100 }}>
              <div className="tab-content">
                <br />
                <div role="tabpanel" className="tab-pane active" id="home1">
                  <h4>Orders</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#ORDER ID</th>
                        <th scope="col">Total</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Delivery Status</th>
                        <th scope="col">Date</th>

                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    {orders?.map((order, index) => (
                      <tbody>
                        <tr>
                          <th scope="row">{order.order_id}</th>
                          <td>{order.total}</td>
                          <td>{order.payment_status.toUpperCase()}</td>
                          <td>{order.order_status}</td>
                          <td>{moment(order.date).format("MMM DD, YYYY")}</td>

                          <td>
                            <Link to={`/vendor/order-detail/${order.order_id}/`}>
                              <a href="" className="btn btn-primary mb-1">
                                <i className="fas fa-eye" />
                              </a>
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorOrders;
