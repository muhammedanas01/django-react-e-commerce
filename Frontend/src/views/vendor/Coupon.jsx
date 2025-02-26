import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Coupon() {
  const [stats, setStats] = useState([]);
  const [coupon, setCoupon] = useState([]);
  const [createCoupon, setCreateCoupon] = useState({
    code: "",
    discount: "",
    active: true,
  });

  const fetchCoupoData = async () => {
    await apiInstance
      .get(`vendor/coupon-stats/${UserData()?.vendor_id}`)
      .then((res) => {
        setStats(res.data);
      });

    await apiInstance
      .get(`vendor/coupon-create/${UserData()?.vendor_id}`)
      .then((res) => {
        setCoupon(res.data);
      });
  };
  useEffect(() => {
    fetchCoupoData();
  }, []);

  const handleDeleteCoupon = async (couponId) => {
    await apiInstance.delete(
      `vendor/coupon-detail/${couponId}/${UserData()?.vendor_id}`
    );
    fetchCoupoData();
    Swal.fire({
      icon: "success",
      title: "Coupon Deleted",
    });
  };

  const handleCouponChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCreateCoupon((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateCouponFunction = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append('vendor_id', UserData()?.vendor_id)
    formData.append('code', createCoupon.code)
    formData.append('discount', createCoupon.discount)
    formData.append('active', createCoupon.active)

    await apiInstance.post(`vendor/coupon-create/${UserData()?.vendor_id}`, formData)
    .then((res) => {
        console.log(res.data)
    })
    fetchCoupoData();
    Swal.fire({
        icon: "success",
        title: "Coupon Created",
    });

  }

  return (
    <>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <VendorSideBar /> 
          <div className="col-md-9 col-lg-10 main mt-4">
            <div className="row mb-3">
              <div className="col-xl-6 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                  <div className="card-block bg-success p-3">
                    <div className="rotate">
                      <i className="bi bi-currency-dollar fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Total Coupon</h6>
                    <h1 className="display-1">{stats[0]?.total_coupons}</h1>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 mb-2">
                <div className="card card-inverse card-danger">
                  <div className="card-block bg-danger p-3">
                    <div className="rotate">
                      <i className="bi bi-currency-dollar fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Active Coupons</h6>
                    <h1 className="display-1">{stats[0]?.active_coupons}</h1>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row  container">
              <div className="col-lg-12">
                <h4 className="mt-3 mb-4">Revenue Tracker</h4>
                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">S/N</th>
                      <th scope="col">Coupon Code</th>
                      <th scope="col">Type</th>
                      <th scope="col">Discount</th>

                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupon.map((c, index) => (
                      <tr>
                        <th scope="row">1</th>
                        <td>{c.code}</td>
                        <td>Percentage</td>
                        <td>{c.discount}%</td>

                        <td>
                          {c.active === true ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">In-Active</span>
                          )}
                        </td>
                        <td>
                          <Link to={`/vendor/coupon-edit/${c.id}`} href="#" className="btn btn-primary btn-sm me-2">
                            <i className="fas fa-edit"></i>
                          </Link>
                          <a
                            onClick={() => handleDeleteCoupon(c.id)}
                            href="#"
                            className="btn btn-danger btn-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                    {coupon.length < 1 && (
                      <h5 className="mt-4 p-3">No Coupons</h5>
                    )}

                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalCenter"
                    >
                      <i className="fas fa-plus"></i> Create Coupon
                    </button>

                    <div
                      className="modal fade"
                      id="exampleModalCenter"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="exampleModalCenterTitle"
                      aria-hidden="true"
                    >
                      <div
                        className="modal-dialog modal-dialog-centered"
                        role="document"
                      >
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title"
                              id="exampleModalLongTitle"
                            >
                              Create Coupon
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>

                          {/* Form Start */}
                          <form onSubmit={handleCreateCouponFunction}>
                            <div className="modal-body">
                              <div className="mb-3">
                                <label className="form-label">
                                  Coupon Code
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter coupon code"
                                  name="code" // ✅ Add 'name' so it matches the state key
                                  onChange={handleCouponChange}
                                  value={createCoupon.code}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">
                                  Discount Details
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  placeholder="Enter Discount"
                                  name="discount" // ✅ Add 'name' so it matches the state key
                                  onChange={handleCouponChange}
                                  value={createCoupon.discount}
                                />
                              </div>

                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="exampleCheck1"
                                  checked={createCoupon.active}
                                  name="active"
                                  onChange={handleCouponChange}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="activeCoupon"
                                >
                                  Active Coupon
                                </label>
                              </div>
                            </div>

                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Close
                              </button>
                              <button type="submit" className="btn btn-primary">
                                Create Coupon
                              </button>
                            </div>
                          </form>
                          {/* Form End */}
                        </div>
                      </div>
                    </div>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Coupon;
