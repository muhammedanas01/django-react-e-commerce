import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";

import Swal from "sweetalert2";

function CustomerSettings() {
  const [profile, setProfile] = useState({});  // Initialize as an object instead of an array
  const userData = UserData();
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch profile data on component mount
  const fetchProfileData = () => {
    apiInstance.get(`user/profile/${userData?.user_id}/`).then((response) => {
      setProfile(response.data);
    });
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle form input changes (e.g., address, state, etc.)
  const handleInputChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  // Handle image input change
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);  // Store image separately
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append the image if it exists
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    // Append other fields if they exist
    if (profile.address) formData.append("address", profile.address);
    if (profile.state) formData.append("state", profile.state);
    if (profile.country) formData.append("country", profile.country);
    if (profile.full_name) formData.append("full_name", profile.full_name);
    if (profile.city) formData.append("city", profile.city);

    try {
      // Sending PATCH request to update profile
      await apiInstance.patch(`users/profile/${userData?.user_id}/`, formData, {
        headers:{
          'Content-Type':'multipart/form-data'
        }
      })
      // Reload the page after successful update
      window.location.reload();
    } catch (error) {
      console.log("Error updating profile:", error);
      console.log("Response data:", error.response?.data);
    }
  };

  return (
    <main className="mt-5">
      <div className="container">
        <section>
          <div className="row">
            <SideBar />
            <div className="col-lg-9 mt-1">
              <section>
                <main className="mb-5">
                  <div className="container px-4">
                    <section>
                      <h3 className="mb-3">
                        <i className="fas fa-gear fa-spin" /> Settings
                      </h3>
                      <form
                        encType="multipart/form-data"
                        onSubmit={handleFormSubmit}
                      >
                        <div className="row">
                          <div className="col-lg-12 mb-3">
                            <label htmlFor="fullName" className="form-label">
                              Profile Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              id="fullName"
                              onChange={handleImageChange}
                              name="image"
                            />
                          </div>
                          <br />
                          <div className="col-lg-12">
                            <label htmlFor="fullName" className="form-label">
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="fullName"
                              value={profile.full_name || ""}
                              onChange={handleInputChange}
                              name="full_name"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="email" className="form-label">
                              Email address
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              id="email"
                              value={profile.user?.email || ""}
                              readOnly
                              name="email"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="phone" className="form-label">
                              Mobile
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="phone"
                              value={profile.user?.phone_number || ""}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  phone_number: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <br />
                        <div className="row">
                          <div className="col-lg-6">
                            <label htmlFor="address" className="form-label">
                              Address
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="address"
                              value={profile.address || ""}
                              onChange={handleInputChange}
                              name="address"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="city" className="form-label">
                              City
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="city"
                              value={profile.city || ""}
                              onChange={handleInputChange}
                              name="city"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="state" className="form-label">
                              State
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="state"
                              value={profile.state || ""}
                              onChange={handleInputChange}
                              name="state"
                            />
                          </div>
                          <div className="col-lg-6 mt-3">
                            <label htmlFor="country" className="form-label">
                              Country
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="country"
                              value={profile.country || ""}
                              onChange={handleInputChange}
                              name="country"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary mt-5"
                        >
                          Save Changes
                        </button>
                      </form>
                    </section>
                  </div>
                </main>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CustomerSettings;
