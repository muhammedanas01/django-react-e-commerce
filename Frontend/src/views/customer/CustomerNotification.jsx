import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';

import Swal from "sweetalert2";

function CustomerNotification() {
  const [notifications, setNotifications] = useState([]);

  const userData = UserData();

  const fetchNotifications = () => {
    apiInstance
      .get(`customer/notification/${userData?.user_id}/`)
      .then((response) => {
        setNotifications(response.data);
      })
      .catch((error) => console.error('Error fetching notifications:', error));
  };

  useEffect(() => {
    fetchNotifications();
    console.log(notifications)
  }, []);
  
  useEffect(() => {
    
    console.log(notifications)
  }, []);
  
  
  

  const markNotificationAsSeen = (user_id, notification_id) => {
    // Call the API to mark the notification as seen
    apiInstance
      .get(`customer/notification/${user_id}/${notification_id}/`)
      .then((response) => {
        // Update the local state directly
        fetchNotifications();
  
        // Show success message
        Swal.fire({
          icon: "success",
          text: "Notification marked as seen",
        });
      })
      .catch((error) => console.error("Error marking notification as seen:", error));
  };
  
  return (
    <>
      <style>
        {`
          .notification-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fff;
            padding: 16px;
            margin-bottom: 16px;
          }
          .notification-item.active {
            background-color: #f8f9fa;
          }
          .btn-custom {
            background-color: #007bff;
            color: white;
            font-weight: bold;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            transition: all 0.3s ease;
          }
          .btn-custom:hover {
            background-color: #0056b3;
            color: white;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      <main className="mt-5">
        <div className="container">
          <section className="">
            <div className="row">
              <SideBar />

              <div className="col-lg-9 mt-1">
                <section className="">
                  <main className="mb-5">
                    <div className="container px-4">
                      <section className="">
                        <h3 className="mb-3">
                          <i className="fas fa-bell" /> Notifications{" "}
                        </h3>
                        <div className="list-group">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`notification-item ${
                                  notification.seen ? "" : "active"
                                }`}
                              >
                                <div className="d-flex w-100 justify-content-between">
                                  <h5 className="mb-1">
                                    {notification.order?.full_name || "No Title"}
                                  </h5>
                                  <small>
                                    {new Date(notification.date).toLocaleString()}
                                  </small>
                                </div>
                                <p className="mb-1">
                                  {notification.order?.email ||
                                    "No additional details provided."}
                                </p>
                                <small>
                                  Order Status: {notification.order?.order_status || "N/A"}
                                </small>
                                {!notification.seen && (
                                  <button
                                    className="btn btn-custom btn-sm mt-3"
                                    onClick={() =>
                                      markNotificationAsSeen(userData?.user_id, notification.id)
                                    }
                                  >
                                    Mark as Seen
                                  </button>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted">No notifications available.</p>
                          )}
                        </div>
                      </section>
                    </div>
                  </main>
                </section>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default CustomerNotification;
