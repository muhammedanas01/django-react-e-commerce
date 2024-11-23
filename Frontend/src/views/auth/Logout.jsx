import React from "react";
import { useEffect } from "react";
import { logout } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";

import "../Style/buttonstyle.css";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/logout");
  }, []);

  return (
    <section>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4 text-center">
                    <h3 className="text-center"></h3>
                    <h3 className="premium-text">You have been logged out</h3>

                    <Link
                      className="btn btn-primary btn-lg mb-3 d-flex justify-content-center align-items-center lux-btn-login"
                      to="/login"
                    >
                      <i className="fas fa-sign-in-alt me-2" />
                      Login
                    </Link>
                    <Link
                      className="btn btn-success btn-lg d-flex justify-content-center align-items-center lux-btn-signup"
                      to="/register"
                    >
                      <i className="fas fa-user-plus me-2" />
                      Sign Up
                    </Link>

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      ></div>
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

export default Logout;

// {isLoading ? (
//   <button
//     type="submit"
//     disabled
//     className="btn btn-primary btn-lg w-100 mb-3 d-flex justify-content-center align-items-center lux-btn">
//     Processing
//     <i className="fas fa-spinner fa-spin ms-2" />
//   </button>
//     ) : (
//   <button
//     type="submit"
//     className="btn btn-primary btn-lg w-100 mb-3 d-flex justify-content-center align-items-center lux-btn">
//     SignUp
//     <i className="fas fa-user-plus ms-2" />
//   </button>
// )}
