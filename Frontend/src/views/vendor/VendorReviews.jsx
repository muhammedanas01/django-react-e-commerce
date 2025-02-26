import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";

function VendorReviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    apiInstance
      .get(`vendor/review-list/${UserData()?.vendor_id}`)
      .then((response) => {
        setReviews(response.data);
      });
  }, []);
  return (
    <>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <VendorSideBar />
          <div className="col-md-9 col-lg-10 main mt-4">
            <h4>
              <i className="fas fa-star" /> Reviews and Rating
            </h4>

            <section
              className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"
              style={{
                backgroundImage:
                  "url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)",
              }}
            >
              {reviews.map((r, index) => (
                <div
                  key={r.id}
                  className="row d-flex justify-content-center align-items-center"
                >
                  <div className="col-md-10">
                    <div className="card mt-3 mb-3">
                      <div className="card-body m-3">
                        <div className="row">
                          <div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
                            <img
                              src={r.product?.image || "default-product.jpg"} // Fix: Correct image field
                              className="rounded-circle img-fluid shadow-1"
                              alt="product"
                             
                              style={{borderRadius: "50px", width:"150px", height:"150px" }}
                            />
                          </div>
                          <div className="col-lg-8">
                            <p className="text-dark fw-bold mb-4">
                              Review: <i>{r.review}</i>
                            </p>
                            <p className="fw-bold text-dark mb-2">
                              <strong>Name: {r.name || "Unknown"}</strong>
                            </p>
                            <p className="fw-bold text-muted mb-0">
                              Product:{" "}
                              {r.product?.title || "No product specified"}{" "}
                              {/* ✅ Fix here */}
                            </p>
                            <p className="fw-bold text-muted mb-0">
                              Rating: {r.rating}{" "}
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`fas fa-star ${i < r.rating ? "text-warning" : "text-muted"}`}
                                />
                              ))}
                            </p>

                            <div className="d-flex mt-3">
                              <a href="#" className="btn btn-primary">
                                Reply <i className="fas fa-pen" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorReviews;
