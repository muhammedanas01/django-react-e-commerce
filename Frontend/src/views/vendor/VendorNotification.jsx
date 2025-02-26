import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function VendorNotification() {
  const [notification, setNotifcation] = useState([]);
  const [stats, setStats] = useState([]);

  const fetchNotificationStats = async () => {
    await apiInstance
      .get(`vendor/notification-summary/${UserData()?.vendor_id}`)  
      .then((res) => {
        //setStats(res.data);
        setStats(res.data);
      });
  };

  const fetchNotification = async () => {
    await apiInstance
      .get(`vendor/notification/${UserData()?.vendor_id}`)
      .then((res) => {
        setNotifcation(res.data);
      });
  };

  useEffect(() => {
    fetchNotification();
    fetchNotificationStats()
  }, []);

  const markNotificationAsSeen = async (notiID) => {
    console.log(notiID)
    await apiInstance.get(`vendor/noti-mark-as-seen/${notiID}/${UserData()?.vendor_id}`)
    .then((res) => {
        console.log(res.data)
        fetchNotification()
        fetchNotificationStats()
    })
  }

  useEffect(() => {
    fetchNotification();
    fetchNotificationStats()
  }, []);

  return (
    <>
      <div className="container-fluid" id="main">
        <div className="row row-offcanvas row-offcanvas-left h-100">
          <VendorSideBar />

          <div className="col-md-9 col-lg-10 main mt-4">
            <div className="row mb-3">
              <div className="col-xl-4 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                  <div className="card-block bg-danger p-3">
                    <div className="rotate">
                      <i className="bi bi-tag fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Un-read Notification</h6>
                    <h1 className="display-1">{stats[0]?.unread_notification}</h1>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                  <div className="card-block bg-success p-3">
                    <div className="rotate">
                      <i className="bi bi-tag fa-5x" />
                    </div>
                    <h6 className="text-uppercase">Read Notification</h6>
                    <h1 className="display-1">{stats[0]?.read_notification}</h1>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 mb-2">
                <div className="card card-inverse card-success">
                  <div className="card-block bg-primary p-3">
                    <div className="rotate">
                      <i className="bi bi-tag fa-5x" />
                    </div>
                    <h6 className="text-uppercase">All Notification</h6>
                    <h1 className="display-1">{stats[0]?.all_notification}</h1>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row  container">
              <div className="col-lg-12">
                <h4 className="mt-3 mb-1">
                  {" "}
                  <i className="fas fa-bell" /> Notifications
                </h4>

                <table className="table">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col">S/N</th>
                      <th scope="col">Type</th>
                      <th scope="col">Message</th>
                      <th scope="col">Status</th>
                      <th scope="col">Date</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notification.map((n, index) => (
                      <tr>
                        <th>1</th>
                        <td>New Order</td>
                        <td>
                          You've got a new order for{" "}
                          <b>{n.order_item?.product.title}</b>
                        </td>
                        {n.seen === true && (
                          <td>
                            read <i className="fas fa-eye" />
                          </td>
                        )}
                        {n.seen === false && (
                          <td>
                            Unreadread <i className="fas fa-eye-slash" />
                          </td>
                        )}

                        <td>{moment(n.date).format("MMM DD, YYYY")}</td>
                        <td>
                          <a onClick={() => markNotificationAsSeen(n.id)} href="#" className="btn btn-secondary mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                    ))}
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

export default VendorNotification;
