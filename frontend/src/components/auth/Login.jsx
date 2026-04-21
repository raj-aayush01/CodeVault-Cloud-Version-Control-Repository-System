import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import "./auth.css";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/login", {
        email: email,
        password: password,
      });

      const userId = res.data.user?._id || res.data._id;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", userId);
      setCurrentUser(userId);

      setLoading(false);

      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
            <h2>Sign In</h2>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>

        <div className="pass-box">
          <p>
            New to GitHub?{" "}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;