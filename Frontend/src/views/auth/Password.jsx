import React from "react";
import apiInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

import "../Style/ButtonStyle.css";
import "../Style/forgetPassword.css";

import { useState } from "react";
// forgot password
function Password() {
  const [email, setEmail] = useState("");
  const[isLoading, setIsLoading] = useState("")
  const naviagte = useNavigate();

  const handleSumbit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await apiInstance.get(`user/password-reset/${email}/`) // here we will sent email to this endpoint.
        console.log(response.data)
        alert("an email has been sent you.")
        setIsLoading(false)
    } catch (error) {
      console.log("error is:", error)
      alert("Email Does Not Exist")
      setIsLoading(false)
    }
  };

  return (
    <div>
      <section>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
          <div className="container">
            {/* Section: Login form */}
            <section className="">
              <div className="row d-flex justify-content-center">
                <div className="col-xl-5 col-md-8">
                  <div className="card rounded-5">
                    <div className="card-body p-4">
                      <h3 className="text-center forget-password-header">Forgot Password</h3>
                      <br />

                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-login"
                          role="tabpanel"
                          aria-labelledby="tab-login"
                        >
                          <div>
                            {/* Email input */}
                            <form onSubmit={handleSumbit}>
                              <div className="form-outline mb-4">
                                <label htmlFor="" className="highlighted-email">Enter Your Email </label>
                                <label
                                  className="form-label highlighted-label"
                                  htmlFor="email"
                                >
                                  Please provide the email address you
                                  registered with.
                                </label>
                                <input
                                  type="text"
                                  id="email"
                                  name="email"
                                  className="forget-password-form-control"
                                  placeholder="example@gmail.com"
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>

                              <div className="text-center">
                                {isLoading === true
                                  ? <button className="btn btn-primary w-100 ">
                                   Proccessing <i className="fas fa-spinner fa-spin"/></button>
                                  :<button className="btn btn-primary w-100 ">
                                  Sent Email <i className="fas fa-paper-plane"/>
                                </button>
                                }
                              </div>
                            </form>
                          </div>
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

export default Password;
