import React, { useState, useEffect } from "react";
import { login as authlogin } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = useAuthStore((state) => state.setLoggedIn);
  console.log(email);
  console.log(password);
  useEffect(() => {
    console.log("Checking login status...");
    console.log("isLoggedInnnnnn:", isLoggedIn());
    if (isLoggedIn()) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);
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
      alert(error);
    } else {
      navigate("/");
      resetForm();
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Login to continue</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
      <h3>
        Dont have an account?<Link to="/register">SignUp here</Link>
      </h3>
    </div>
  );
}

export default Login;
