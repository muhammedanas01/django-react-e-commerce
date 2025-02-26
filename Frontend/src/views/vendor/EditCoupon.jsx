import React from 'react'
import { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function EditCoupon() {
    const [couponToEdit, setCouponToEdit] = useState([])
    const param = useParams()
    console.log(param)
    const navigate = useNavigate()

    useEffect(() => {
        apiInstance.get(`vendor/coupon-detail/${param.coupon_id}/${UserData()?.vendor_id}`)
        .then((res) => {
            setCouponToEdit(res.data)
            console.log(res.data)
        })
    },[])

    const handleDeleteCoupon = async (couponId) => {
        await apiInstance.delete(
          `vendor/coupon-detail/${couponId}/${UserData()?.vendor_id}`
        );
        fetchCoupoData();
      };

    const handleCouponChange = (event) => {
        const { name, value, type, checked } = event.target;
        setCouponToEdit((prevState) => ({
          ...prevState,
          [name]: type === "checkbox" ? checked : value,
        }));
      };
    
    const handleUpdateCouponFunction = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append('vendor_id', UserData()?.vendor_id)
    formData.append('code', couponToEdit.code)
    formData.append('discount', couponToEdit.discount)
    formData.append('active', couponToEdit.active)

    await apiInstance.post(`vendor/coupon-create/${UserData()?.vendor_id}`, formData)
    .then((res) => {
        console.log(res.data)
    })
    
    Swal.fire({
        icon: "success",
        title: "Coupon Updated",
    });

    handleDeleteCoupon(param.coupon_id)
    navigate(`/vendor/coupon/`)

}
  return (
    <>
    <div className="container-fluid" id="main" >
    <div className="row row-offcanvas row-offcanvas-left h-100">
    <VendorSideBar />   
        <div className="col-md-9 col-lg-10 main mt-4">
            <h4 className="mt-3 mb-4"><i className="bi bi-tag" /> Coupons</h4>
            <form onSubmit={handleUpdateCouponFunction} className='card shadow p-3'>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                        Code
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name='code'
                        placeholder='Enter Coupon Code'
                        value={couponToEdit.code}
                        onChange={handleCouponChange}
                    />
                    <div id="emailHelp" className="form-text">
                        E.g DESTINY2024
                    </div>
                </div>
                <div className="mb-3 mt-4">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                        Discount
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        name='discount'
                        placeholder='Enter Discount'
                        value={couponToEdit.discount}
                        onChange={handleCouponChange}
                    />
                    <div id="emailHelp" className="form-text">
                        NOTE: Discount is in <b>percentage</b>
                    </div>
                </div>
                <div className="mb-3 form-check">
                    <input checked={couponToEdit.seen} onChange={handleCouponChange} name='active' type="checkbox" className="form-check-input" id="exampleCheck1" />
                    <label className="form-check-label" htmlFor="exampleCheck1">
                        Activate Coupon
                    </label>
                </div>
                <div className="d-flex">
                    <Link to="/vendor/coupon/" className="btn btn-secondary">
                        <i className='fas fa-arrow-left'></i> Go Back
                    </Link>
                    <button type="submit" className="btn btn-success ms-2">
                        Update Coupon <i className='fas fa-check-circle'></i>
                    </button>
                </div>
            </form>
        </div>


    </div>


</div >
    </>
  )
}

export default EditCoupon