// for signup
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { register } from "../../utils/auth";

import "../Style/buttonstyle.css";
import "../Style/register.css"

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(""); // this is for updating button status

  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.setLoggedIn());
  

  console.log(isLoggedIn)
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
      
    }
  }, [isLoggedIn]);

    // useEffect(() => {
    // if (isLoggedIn) { 
    //   alert('You need to log out to access this page');
    //   setTimeout(() => {
    //     navigate('/');
    //   }, 0.0000);
    // }
    // }, [isLoggedIn]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await register(
      fullName,
      email,
      mobile,
      password,
      password2
    );
    if (error) {
      alert(JSON.stringify(error));
      
    } else {
      navigate("/");
    }

    setIsLoading(false);
  };



  
//   if (isLoggedIn) { 
//     alert('you need to logout to access this page')
//     return navigate('/'); 
//   }// Prevent rendering the registration form }

  return (
    <div>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="register-header">Skywalker.</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handleSubmit}>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Full Name
                            </label>
                            <input
                              type="text"
                              id="username"
                              placeholder="Enter Your Full Name"
                              required
                              className="register-form-control"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginName">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              placeholder="example@gmail.com"
                              required
                              className="register-form-control"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="loginName">
                              Mobile Number
                            </label>
                            <input
                              type="text"
                              id="phone"
                              placeholder="Mobile Number"
                              required
                              className="register-form-control"
                              onChange={(e) => setMobile(e.target.value)}
                            />
                          </div>
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              id="password"
                              placeholder="8787!@#$"
                              className="register-form-control"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          {/* Password input */}
                          <div className="form-outline mb-4">
                            <label
                              className="form-label"
                              htmlFor="loginPassword"
                            >
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              placeholder="8787!@#$"
                              required
                              className="register-form-control"
                              onChange={(e) => setPassword2(e.target.value)}
                            />
                          </div>
                          {/* Password Check */}
                          {/* <p className='fw-bold text-danger'>
                                                    {password2 !== password ? 'Passwords do not match' : ''}
                                                </p> */}

                          {/* <button
                            className="btn btn-primary w-100"
                            type="submit"
                            disabled={isLoading}
                          >
                            <span className="mr-2">Sign Up</span>
                            <i className="fas fa-user-plus" />
                          </button> */}

                          {isLoading === true ? 
                              <button
                              type="submit" disabled
                              className="btn btn-primary btn-rounding w-100 mb premium-btn-processing">
                               Proccesing<i className="fas fa-spinner fa-spin"/></button>

                              :<button
                              type="submit"
                              className="btn btn-primary btn-rounding w-100 mb lux-btn-signup">
                               SignUp <i className="fas fa-user-plus"/></button>

                          }
                          
                          <div className="text-center">
                            <p className="mt-4"  style={{ color: '#28A745'}} >
                              Already have an account?{" "}
                              <Link to="/login/" style={{ color: "#007BFF" }}>Login</Link>
                            </p>
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
    </div>
  );
}

export default Register;
