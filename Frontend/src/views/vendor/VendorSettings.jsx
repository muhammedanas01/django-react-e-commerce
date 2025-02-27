
import React, { useEffect, useState } from "react";
import VendorSideBar from "./VendorSideBar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import moment from "moment";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function VendorSettings() {
    const [profileData, setProfileData] = useState({})
    const [profileImage, setProfileImage] = useState('')
    const [vendorData, setVendorData] = useState({})
    const [vendorImage, setVendorImage] = useState([])

    const fetchVendorData = () => {
      apiInstance.get(`vendor/shop-update/${UserData()?.vendor_id}`).then((res) => {
        setVendorData(res.data)
        setVendorImage(res.data.image)
        console.log(res.data)
      })
    }

    const fetchProfileData = async () => {
        apiInstance.get(`vendor/profile-update/${UserData()?.vendor_id}`)
        .then((res) => {
            setProfileData(res.data)
            setProfileImage(res.data.image)
        })
    }
    useEffect(() => {
        fetchProfileData()
        fetchVendorData()
        //console.log(profileData.user.phone_number)
    },[])
  

    const handleInputChange = (event) => {
        const { name, value } = event.target;
    
        setProfileData((prevData) => ({
            ...prevData, // Preserve existing data
            [name]: value, // Update only the changed field
        }));
    
        console.log(value);
    };

    const handleVendorChange = (event) => {
      const { name, value } = event.target;
  
      setVendorData((prevData) => {
          if (["full_name", "email"].includes(name)) {
              // Update fields inside user object
              return {
                  ...prevData,
                  user: {
                      ...prevData.user,
                      [name]: value,
                  },
              };
          } else {
              // Update other vendor-level fields
              return {
                  ...prevData,
                  [name]: value,
              };
          }
      });
  
      console.log(`Updated ${name}:`, value);
  };
  
  
  

    //for image
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the selected file
    
        setProfileData((prevData) => ({
            ...prevData, // Preserve existing data
            [event.target.name]: file // Update only the changed field
        }));
    
        console.log(file); // Log the selected file instead of `value`
    };
    //for shop
    const handleVendorFileChange = (event) => {
      const file = event.target.files[0]; // Get the selected file
      if (!file) return; // Exit if no file is selected
  
      setVendorData((prevData) => ({
          ...prevData,
          image: file, // Store the file object in state
      }));
  
      console.log("Selected file:", file);
  };
  

    const handleUpdateProfileFunction = async (e) => {
        e.preventDefault();
        console.log("Profile update submitted");
    
        try {
            const res = await apiInstance.get(`vendor/profile-update/${UserData()?.vendor_id}`);
            const existingData = res?.data || {}; 
    
            const formData = new FormData();
    
            if (profileData.image && profileData.image !== existingData.image) {
                formData.append("image", profileData.image);
            }
            if (profileData.full_name) {
                formData.append("full_name", profileData.full_name);
            }
            if (profileData.description) {
                formData.append("about", profileData.description);
            }
    
            const updateRes = await apiInstance.patch(
                `vendor/profile-update/${UserData()?.vendor_id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            console.log("Profile updated successfully:", updateRes.data);
    
            // Update the profile data state
            setProfileData(updateRes.data);
    
            // Update the profileImage state
            setProfileImage(updateRes.data.image);

            Swal.fire({
                    icon: "success",
                    title: "Profile Updated",
                });
            
    
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const handleUpdateVendorShopFunction = async (e) => {
      e.preventDefault();
      console.log("Profile update submitted");
  
      try {
          const res = await apiInstance.get(`vendor/shop-update/${UserData()?.vendor_id}`);
          const existingData = res?.data || {}; 
  
          const formData = new FormData();
  
          // Only append the fields if they have changed
          if (vendorData.image && vendorData.image !== existingData.image) {
              formData.append("image", vendorData.image); // Use vendorData.image
          }
          if (vendorData.user?.full_name && vendorData.user.full_name !== existingData.full_name) {
              formData.append("full_name", vendorData.user.full_name);
          }
          if (vendorData.description && vendorData.description !== existingData.about) {
              formData.append("about", vendorData.description);
          }
  
          if ([...formData.entries()].length === 0) {
              alert("No changes detected.");
              return;
          }
  
          const updateRes = await apiInstance.patch(
              `vendor/shop-update/${UserData()?.vendor_id}`,
              formData,
              {
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              }
          );
  
          console.log("Profile updated successfully:", updateRes.data);
  
          // Update the vendorData state
          setVendorData((prevData) => ({
              ...prevData,
              user: {
                  ...prevData.user,
                  full_name: updateRes.data.full_name || prevData.user.full_name,
              },
              image: updateRes.data.image || prevData.image,
              description: updateRes.data.about || prevData.description,
          }));
  
          setVendorImage(updateRes.data.image); // Update vendor image state
  
          Swal.fire({
              icon: "success",
              title: "Shop Updated",
          });
  
      } catch (error) {
          console.error("Error updating shop:", error);
          alert("Failed to update shop. Please try again.");
      }
  };
  
  return (
   <>
   <div className="container-fluid" id="main">
  <div className="row row-offcanvas row-offcanvas-left h-100">
  <VendorSideBar />
    <div className="col-md-9 col-lg-10 main mt-4">
      <div className="container">
        <div className="main-body">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                Profile
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                Shop
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-center text-center">
                        <img
                          src={profileImage}
                          style={{ width: 160, height: 160, objectFit: "cover" }}
                          alt="Admin"
                          className="rounded-circle"
                          width={150}
                        />
                        <div className="mt-3">
                          <h4 className="text-dark">{vendorData.name}</h4>
                          {/* <p className="text-secondary mb-1">Web Developer</p> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card mb-3">
                    <div className="card-body">
                      <form
                        className="form-group"
                        method="POST"
                        noValidate=""
                        encType="multipart/form-data"
                        onSubmit={handleUpdateProfileFunction}
                      >
                        <div className="row text-dark">
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Profile Image
                            </label>
                            <input
                              type="file"
                              className="form-control"
                              name="image"
                              id=""
                              onChange={handleFileChange}
                            />
                          </div>
                          <div className="col-lg-6 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="full_name"
                              id=""
                              value={profileData.full_name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Email
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name=""
                              id=""
                              value={profileData?.user?.email}
                              readOnly

                            />
                          </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="mobile"
                              id=""
                              value={profileData?.user?.phone_number}
                              onChange={handleInputChange}


                            />
                          </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              About Me
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="about"
                              id=""
                              onChange={handleInputChange}

                            />
                          </div>
                          <div className="col-lg-6 mt-4 mb-3">
                            <button className="btn btn-success" type="submit">
                              Update Profile <i className="fas fa-check-circle" />{" "}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div className="row gutters-sm shadow p-4 rounded">
                <div className="col-md-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-center text-center">
                        <img
                          src={vendorImage}
                          style={{ width: 160, height: 160, objectFit: "cover" }}
                          alt="Admin"
                          className="rounded-circle"
                          width={150}
                        />
                        <div className="mt-3">
                          <h4 className="text-dark">Desphixs</h4>
                          <p className="text-secondary mb-1">{vendorData.description || "no description given"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card mb-3">
                    <div className="card-body">
                      <form
                        className="form-group"
                        method="POST"
                        noValidate=""
                        encType="multipart/form-data"
                        onSubmit={handleUpdateVendorShopFunction}
                      >
                        <div className="row text-dark">
                          <div className="col-lg-12 mb-2">
                            <label htmlFor="" className="mb-2">
                              Shop Image
                              <input
                              type="file"
                              className="form-control"
                              name="image"
                              id=""
                              onChange={handleVendorFileChange}
                            />
                            </label>
                            <input
                              type="text"
                              value={vendorData?.name || ""}
                              className="form-control"
                              name="name"
                              id=""
                              onChange={handleVendorChange}
                             
                            />
                          </div>
                          
                          <div className="col-lg-12 mb-2 ">
                            <label htmlFor="" className="mb-2">
                              Full Name
                            </label>
                            <input
                              value={vendorData?.user?.full_name || ""}
                              type="text"
                              className="form-control"
                              name="full_name"
                              id=""
                              onChange={handleVendorChange}

                            />
                          </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Email
                            </label>
                            <input
                              value={vendorData?.user?.email || ""}
                              type="text"
                              className="form-control"
                              name="email"
                              id=""
                              onChange={handleVendorChange}

                            />
                          </div>
                          <div className="col-lg-6 mb-2">
                            <label htmlFor="" className="mb-2">
                              Phone Number
                            </label>
                            <input
                              value={vendorData?.mobile|| ""}
                              type="text"
                              className="form-control"
                              name="mobile"
                              id=""
                              onChange={handleVendorChange}

                            />
                          </div>
                          <div className="col-lg-6 mt-4 mb-3">
                            <button className="btn btn-success" type="submit">
                              Update Shop <i className="fas fa-check-circle" />{" "}
                            </button>
                            <Link to={`/vendor/${vendorData.slug}`}className="btn btn-primary" type="submit">
                              View Shop <i className="fas fa-shop" />{" "}
                            </Link>
                          </div>
            
                        </div>
                      </form>
                    </div>
                  </div>
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
  )
}

export default VendorSettings