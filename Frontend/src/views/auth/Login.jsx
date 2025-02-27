import React, { useState, useEffect } from "react";
import { login as authlogin } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

import "../Style/login.css";
import "../Style/buttonstyle.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.setLoggedIn);

  // this useeffect is for when user is already logged in and still try to access login
  // ...page
  useEffect(() => {
    console.log(isLoggedIn())
    if (isLoggedIn()) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn]);

  
  //when ever we call this usestate function it makes username and password as empty.
  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // default is false now we say we are proccessing user login details.

    const { error } = await authlogin(email, password);

    if (error) {
      alert("no account with given credentials");
      setIsLoading(false);
    } else {
      navigate("/");
      resetForm();
    }
    setIsLoading(false);
  };

  return (
    <section>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center login-header">NexBuy</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handleLogin}>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="login-form-control"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
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
                              name="password"
                              className="login-form-control"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>

                          {/* <button
                            className="btn btn-primary w-100"
                            type="submit"
                          >
                            <span className="mr-2">Sign In </span>
                            <i className="fas fa-sign-in-alt" />
                          </button> */}

                          {isLoading === true ? (
                            <button
                              type="submit"
                              disabled
                              className="btn btn-primary btn-rounding w-100 mb "
                            >
                              Proccesing
                              <i className="fas fa-spinner fa-spin" />
                            </button>
                          ) : (
                            <button
                              type="submit"
                              className="btn btn-primary btn-rounding w-100 mb"
                            >
                              Log in <i className="fas fa-sign-in-alt" />
                            </button>
                          )}

                          <div className="text-center">
                            <p className="mt-4" style={{ color: "#007BFF" }}>
                              Don't have an account?{" "}
                              <Link to="/register" style={{ color: '#28A745'}}>Register</Link>
                            </p>

                            <p className="mt-0">
                              <Link
                                to="/forget-password-reset"
                                className="text-danger"
                              >
                                Forgot Password?
                              </Link>
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
    </section>
  );
}

export default Login;
