import { useState, useEffect } from "react";
import apiInstance from "../../utils/axios";

import UserData from "../plugin/UserData";

import VendorSideBar from "./VendorSideBar";

import { Line, Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function DashboardVentor() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [orderChartData, setOrderChartData] = useState([]);
  const [productChartData, setProductChartData] = useState([]);
  const [products, setProducts] = useState([]);

  const userData = UserData();

  useEffect(() => {
    if (!userData?.vendor_id) return;

    apiInstance
      .get(`vendor/stats/${userData?.vendor_id}`)
      .then((response) => {
        setStats(response.data[0]); // Assuming API returns an array with one object
      })
      .catch((error) => {
        console.error("Error fetching vendor stats:", error);
      });
  }, [userData?.vendor_id]); // Re-fetch if vendor_id changes

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const order_response = await apiInstance.get(
          `vendor-orders-report/${userData?.vendor_id}`
        );
        setOrderChartData(order_response.data);
        const product_response = await apiInstance.get(
          `vendor-product-report/${userData?.vendor_id}`
        );
        setProductChartData(product_response.data);
      } catch (error) {
        console.error("Error fetching vendor orders:", error);
      }
    };

    fetchOrders();
  }, []);

  apiInstance.get(`vendor/products/${userData?.vendor_id}`);
  useEffect(() => {
    apiInstance
      .get(`vendor/products/${userData?.vendor_id}`)
      .then((response) => {
        //console.log(response.data);
      });
  }, []);

  const order_months = orderChartData?.map((item) => item.month);
  const order_counts = orderChartData?.map((item) => item.month);

  const product_months = productChartData?.map((item) => item.month);
  const product_counts = productChartData?.map((item) => item.month);

  const order_data = {
    labels: order_months,
    datasets: [
      {
        label: "Total Orders",
        data: order_counts,
        fill: true,
        backgroundColor: "green",
        borderColor: "green",
      },
    ],
  };

  const product_data = {
    labels: product_months,
    datasets: [
      {
        label: "Total Orders",
        data: product_counts,
        fill: true,
        backgroundColor: "blue",
        borderColor: "blue",
      },
    ],
  };

  //console.log(product_data);

  useEffect(() => {
    apiInstance
      .get(`vendor/products/${userData?.vendor_id}`)
      .then((response) => {
        setProducts(response.data);
      });
  }, []);

  return (
    <>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <VendorSideBar />
          <div className="col-md-9 col-lg-10 main mt-4">
            <div className="row mb-3">
              <div className="col-xl-3 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                  <div className="card-block bg-success p-3">
                    <div className="rotate">
                      <i className="bi bi-grid fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Products</h6>
                    <h1 className="display-1">{stats.products}</h1>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 mb-2">
                <div className="card card-inverse card-danger">
                  <div className="card-block bg-danger p-3">
                    <div className="rotate">
                      <i className="bi bi-cart-check fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Orders</h6>
                    <h1 className="display-1">{stats.orders}</h1>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 mb-2">
                <div className="card card-inverse card-info">
                  <div className="card-block bg-info p-3">
                    <div className="rotate">
                      <i className="bi bi-people fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Customers</h6>
                    <h1 className="display-1">{stats.revenue}</h1>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 mb-2">
                <div className="card card-inverse card-warning">
                  <div className="card-block bg-warning p-3">
                    <div className="rotate">
                      <i className="bi bi-currency-dollar fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Revenue</h6>
                    <h1 className="display-1">$36</h1>
                  </div>
                </div>
              </div>
            </div>
            {/*/row*/}
            <hr />
            <div className="container">
              <div className="row my-3">
                <div className="col">
                  <h4>Chart Analytics</h4>
                </div>
              </div>

              {/* Orders Chart */}
              <div className="row my-2">
                <div className="col-md-6 py-1">
                  <div className="card">
                    <div className="card-body">
                      <h5>Orders Analytics</h5>
                      <Bar data={order_data} />
                    </div>
                  </div>
                </div>

                {/* Products Chart */}
                <div className="col-md-6 py-1">
                  <div className="card">
                    <div className="card-body">
                      <h5>Products Analytics</h5>
                      <Bar data={product_data} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <a id="layouts" />
            <hr />
            <div className="row mb-3 container">
              <div className="col-lg-12" style={{ marginBottom: 100 }}>
                {/* Nav tabs */}
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      href="#home1"
                      role="tab"
                      data-toggle="tab"
                    >
                      Products
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#profile1"
                      role="tab"
                      data-toggle="tab"
                    >
                      Orders
                    </a>
                  </li>
                </ul>
                {/* Tab panes */}
                <div className="tab-content">
                  <div role="tabpanel" className="tab-pane active" id="home1">
                    <h4>Products</h4>
                    <table className="table">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">#ID</th>
                          <th scope="col">Name</th>
                          <th scope="col">Price</th>
                          <th scope="col">Quantity</th>
                          <th scope="col">Orders</th>
                          <th scope="col">Status</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <th scope="row">
                              <img
                                src={product.image}
                                alt={product.title}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover", // This ensures the image aspect ratio is maintained without stretching
                                  borderRadius: "5px",
                                  objectFit:"cover"
                                 // Optional, for rounded corners
                                }}
                              />
                            </th>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>{product.stock_quantity}</td>
                            <td>{product.orders}</td>
                            <td>{product.status}</td>
                            <td>
                              <a
                                href="#"
                                className="btn btn-primary mb-1"
                                style={{ marginRight: "8px" }}
                              >
                                <i className="fas fa-eye" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-success mb-1"
                                style={{ marginRight: "8px" }}
                              >
                                <i className="fas fa-edit" />
                              </a>
                              <a
                                href="#"
                                className="btn btn-danger mb-1"
                                style={{ marginRight: "0" }}
                              >
                                <i className="fas fa-trash" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Orders table (can populate dynamically like products) */}
                  <div role="tabpanel" className="tab-pane" id="profile1">
                    <h4>Orders</h4>
                    <table className="table">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">#Order ID</th>
                          <th scope="col">Total</th>
                          <th scope="col">Payment Status</th>
                          <th scope="col">Delivery Status</th>
                          <th scope="col">Date</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>{/* Order rows go here */}</tbody>
                    </table>
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

export default DashboardVentor;
