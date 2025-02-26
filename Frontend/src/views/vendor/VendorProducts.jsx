import React from "react";
import { useState, useEffect } from "react";
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";

import UserData from "../plugin/UserData";

import VendorSideBar from "./VendorSideBar";
function VendorProducts() {
  const [products, setProducts] = useState([]);
  const userData = UserData();

  useEffect(() => {
    apiInstance
      .get(`vendor/products/${userData?.vendor_id}`)
      .then((response) => {
        setProducts(response.data);
      });
  }, []);

  const handleDeleteProduct = async (product_id) => {
    try {
        await apiInstance.delete(`vendor-delete-product/${userData.vendor_id}/${product_id}/`);
        
        // Remove the deleted product from state
        setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== product_id)
        );
    } catch (error) {
        console.error("Error deleting product:", error);
    }
};


  return (
    <>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          {/* Add Side Bar Here */}
          <VendorSideBar />

          <div className="col-md-9 col-lg-10 main mt-4">
            {/*/row*/}

            <a id="layouts" />

            <div className="row mb-3 container">
              <div className="col-lg-12" style={{ marginBottom: 100 }}>
                <div className="tab-content">
                  <br />
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
                                  objectFit: "cover",
                                  // Optional, for rounded corners
                                }}
                              />
                            </th>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>{product.stock_quantity}</td>
                            <td>{product.orders}</td>
                            <td>{product.status.toUpperCase()}</td>
                            <td>
                              <Link
                                to={`/product-detail/${product.slug}/`}
                                className="btn btn-primary mb-1"
                                style={{ marginRight: "8px" }}
                              >
                                <i className="fas fa-eye" />
                              </Link>
                              <Link
                                to={`/vendor/product/update/${product.id}`}
                                className="btn btn-success mb-1"
                                style={{ marginRight: "8px" }}
                              >
                                <i className="fas fa-edit" />
                              </Link>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                href="#"
                                className="btn btn-danger mb-1"
                                style={{ marginRight: "0" }}
                              >
                                <i className="fas fa-trash" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                      <tbody>
                        <tr>
                          <th scope="row">#trytrr</th>
                          <td>$100.90</td>
                          <td>Paid</td>
                          <td>Shipped</td>
                          <td>20th June, 2023</td>
                          <td>
                            <a href="" className="btn btn-primary mb-1">
                              <i className="fas fa-eye" />
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">#hjkjhkhk</th>
                          <td>$210.90</td>
                          <td>Pending</td>
                          <td>Not Shipped</td>
                          <td>21th June, 2023</td>
                          <td>
                            <a href="" className="btn btn-primary mb-1">
                              <i className="fas fa-eye" />
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row">#retrey</th>
                          <td>$260.90</td>
                          <td>Failed</td>
                          <td>Not Shipped</td>
                          <td>25th June, 2023</td>
                          <td>
                            <a href="" className="btn btn-primary mb-1">
                              <i className="fas fa-eye" />
                            </a>
                          </td>
                        </tr>
                      </tbody>
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

export default VendorProducts;
