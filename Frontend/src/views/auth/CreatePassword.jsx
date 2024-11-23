import React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom"; // hook to get query parameter from url
import apiInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

import "../Style/ButtonStyle.css";
import "../Style/forgetPassword.css";

function CreatePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const [searchParam] = useSearchParams();
  const otp = searchParam.get("otp"); // this is the otp generated when user requested for password reset
  const uidb64 = searchParam.get("uidb64");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password does not match");
      setIsLoading(false)
    } else {
        setIsLoading(true)
      // sents the otb,password and uidb64 to backend for verification.
      const formData = new FormData();
      formData.append("password", password);
      formData.append("otp", otp);
      formData.append("uidb64", uidb64);

      try {
        await apiInstance
          .post(`user/password-change/`, formData) //sending form data to backend.
          .then((response) => {
            console.log(response.data);
          });
        setIsLoading(false)
        alert("password changed successfully");
       
        navigate("/login");
      } catch (error) {
        alert(console.error(error));
        setIsLoading(false)
      }
    }
  };

  return (
    <div>
      <section>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
          <div className="container">
            <section className="">
              <div className="row d-flex justify-content-center">
                <div className="col-xl-5 col-md-8">
                  <div className="card rounded-5">
                    <div className="card-body p-4">
                      <h3 className="text-center forget-password-header">
                        Create New Password
                      </h3>
                      <br />

                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-login"
                          role="tabpanel"
                          aria-labelledby="tab-login"
                        >
                          <form onSubmit={handlePasswordSubmit}>
                            {/* Email input */}
                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Enter New Password
                              </label>
                              <input
                                type="password"
                                id="email"
                                required
                                name="password"
                                className="forget-password-form-control"
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>

                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                id="email"
                                required
                                name="confirmPassword"
                                className="forget-password-form-control"
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                              {/* {error !== null &&
                                                            <>
                                                                {error === true

                                                                    ? <p className='text-danger fw-bold mt-2'>Password Does Not Match</p>
                                                                    : <p className='text-success fw-bold mt-2'>Password Matched</p>
                                                                }
                                                            </>
                                                        } */}
                            </div>

                            <div className="text-center">
                              {isLoading === true ? (
                                <button className="btn btn-primary w-100 ">
                                  Proccessing{" "}
                                  <i className="fas fa-spinner fa-spin" />
                                </button>
                              ) : (
                                <button className="btn btn-primary w-100 ">
                                  Reset Password{" "}
                                  <i className="fas fa-paper-plane" />
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </section>
    </div>
  );
}

export default CreatePassword;
