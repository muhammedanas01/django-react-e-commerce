import React from "react";
import VendorSideBar from "./VendorSideBar";
import { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import { Line, Bar } from "react-chartjs-2";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";
function Earning() {
  const [earning, setEarning] = useState({});
  const [earningTracker, setEarningTracker] = useState([]);
  const [earningChart, setEarningChart] = useState([])

  const months = earningChart?.map((item) => item.month);
  const revenue = earningChart?.map((item) => item.total_earning);

  const revenue_data = {
    labels: months,
    datasets: [
      {
        label: "Total Sales Revenue",
        data: revenue,
        fill: true,
        backgroundColor: "green",
        borderColor: "green",
      },
    ],
  };

  useEffect(() => {
    apiInstance.get(`vendor/earning/${UserData()?.vendor_id}`).then((res) => {
      setEarning(res.data);
    });
  }, []);

  useEffect(() => {
    apiInstance
      .get(`vendor/monthly-earning/${UserData()?.vendor_id}`)
      .then((res) => {
        setEarningTracker(res.data);
        setEarningChart(res.data)
      });
  }, []);

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
                    <h6 className="text-uppercase">Total Sales</h6>
                    <h1 className="display-1">AED {earning.total_revenue}.00</h1>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-6 mb-2">
                <div className="card card-inverse card-danger">
                  <div className="card-block bg-danger p-3">
                    <div className="rotate">
                      <i className="bi bi-currency-dollar fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Monthly Earning</h6>
                    <h1 className="display-1">AED {earning.monthly_revenue}.00</h1>
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
                      <th scope="col">Month</th>
                      <th scope="col">Orders</th>
                      <th scope="col">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningTracker?.map((e, index) => {
                      // Array mapping month numbers (1-12) to month names
                      const months = [
                        "",
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];

                      return (
                        <tr key={index}>
                          <td>{months[e.month] || "Unknown"}</td>{" "}
                          {/* Convert month number to name */}
                          <td>{e.sales_account}</td>
                          <td>${e.total_earning}</td>
                          {console.log(earningTracker)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="container">
                <div className="row ">
                  <div className="col">
                    <h4 className="mt-4">Revenue Analytics</h4>
                     <Bar data={revenue_data} style={ {height:10}} />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-md-12 py-1">
                    <div className="card">
                      <div className="card-body">
                        <canvas id="line-chart" />
                      </div>
                    </div>
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

export default Earning;
