import React, { useEffect, useState } from "react";
import apiInstance from "../../utils/axios";
import { Link } from "react-router-dom";

import "../Style/product-card-btn.css";
// category/
function Products() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    apiInstance.get(`products/`).then((response) => {
      setProducts(response.data);
    });
  }, []);

  useEffect(() => {
    apiInstance.get("category/").then((response) => {
      setCategory(response.data);
    });
  }, []);

  
  return (
    <>
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
            <div className="row">
              {products?.map((p, index) => (
                <div className="col-lg-4 col-md-12 mb-4">
                  <div className="card">
                    <div
                      className="bg-image hover-zoom ripple"
                      data-mdb-ripple-color="light"
                    >
                      <Link to={`/product-detail/${p.slug}/`}>
                        <img
                          src={p.image}
                          className="w-100"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover", 
                          }}
                        />
                      </Link>
                      <a href="#!">
                        <div className="mask">
                          <div className="d-flex justify-content-start align-items-end h-100">
                            <h5>
                              <span className="badge badge-primary ms-2">
                                New
                              </span>
                            </h5>
                          </div>
                        </div>
                        <div className="hover-overlay">
                          <div
                            className="mask"
                            style={{
                              backgroundColor: "rgba(251, 251, 251, 0.15)",
                            }}
                          />
                        </div>
                      </a>
                    </div>
                    <div className="card-body">
                      <a href="" className="text-reset">
                        <h5 className="card-title mb-3">{p.title}</h5>
                      </a>
                      <a href="" className="text-reset">
                        <p>{p.category?.title}</p>
                      </a>
                      <div className="d-flex justify-content-center">
                        <h6 className="mb-3 text-muted ms-2">
                          <strike>₹{p.old_price}</strike>
                        </h6>
                        <h6 className="mb-3 ms-2">₹{p.price}</h6>
                      </div>

                      <div className="btn-group">
                        <button
                          className="btn btn-black  dropdown-toggle"
                          type="button"
                          id="dropdownMenuClickable"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="false"
                          aria-expanded="false"
                        >
                          Variation
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuClickable"
                          style={{ backgroundColor: "white" }}
                        >
                          <div className="d-flex flex-column">
                            <li className="p-1">
                              <b>Size</b>: XL
                            </li>
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                              <li>
                                <button className="btn btn-black btn-sm me-2 mb-1">
                                  S
                                </button>
                              </li>
                              <li>
                                <button className="btn btn-black btn-sm me-2 mb-1">
                                  M
                                </button>
                              </li>
                              <li>
                                <button className="btn btn-black btn-sm me-2 mb-1">
                                  L
                                </button>
                              </li>
                              <li>
                                <button className="btn btn-black btn-sm me-2 mb-1">
                                  XL
                                </button>
                              </li>
                            </div>
                          </div>
                          <div className="d-flex flex-column mt-3">
                            <li className="p-1">
                              <b>Color</b>: Red
                            </li>
                            <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                              <li>
                                <button
                                  className="btn btn-sm me-2 mb-1"
                                  style={{
                                    backgroundColor: "red",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                />
                              </li>
                              <li>
                                <button
                                  className="btn btn-sm me-2 mb-1 p-2"
                                  style={{
                                    backgroundColor: "green",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                />
                              </li>
                              <li>
                                <button
                                  className="btn btn-sm me-2 mb-1 p-2"
                                  style={{
                                    backgroundColor: "brown",
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                  }}
                                />
                              </li>
                            </div>
                          </div>
                          <div className="d-flex mt-3 p-1">
                            <button
                              type="button"
                              className="btn btn-black me-1 mb-1"
                            >
                              <i className="fas fa-shopping-cart" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger px-3 me-1 mb-1 ms-2"
                            >
                              <i className="fas fa-heart" />
                            </button>
                          </div>
                        </ul>
                        <button
                          type="button"
                          className="btn btn-danger px-3 me-1 ms-2"
                        >
                          <i className="fas fa-heart" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="row d-flex flex-wrap">
                <h4>Categories</h4>
                <br />
                <br />
                {category?.map((c, index) => (
                  <button
                    className="col-lg-2 btn p-0 d-flex flex-column align-items-center"
                    style={{ border: "none", backgroundColor: "transparent" }}
                  >
                    <img
                      src={c.image}
                      alt={c.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      className="btn btn-secondary mt-2"
                      style={{
                        width: "100px",
                        backgroundColor: "white",
                        color: "black",
                        display: "block",
                        textAlign: "center",
                        border: "none",
                      }}
                    >
                      <h6>{c.title}</h6>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </>
  );
}

export default Products;
