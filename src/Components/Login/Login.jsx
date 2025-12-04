import React, { useState, useRef, useEffect } from "react";
import "./Login.scss";
import Register from "../Register/Register";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const refName = useRef();
  const refPassword = useRef();
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated, login } = useAuth();

  const SubmitLoginData = async (e) => {
    e.preventDefault();
    const UserName = refName.current.value;
    const Password = refPassword.current.value;

    if (Password === "" || UserName === "") {
      Swal.fire({
        icon: "error",
        title: "Missing Credentials",
        text: "Please enter your username and password",
        confirmButtonColor: "#667eea",
        timer: 3000,
      });
      return;
    }

    setIsProcessing(true);

    try {
      const res = await login(UserName, Password);
      setIsProcessing(false);

      if (res.success && res.isAuthenticated) {
        // Dispatch custom event to notify components of login
        window.dispatchEvent(new Event("rsu-login-success"));

        // Navigate immediately for smooth experience
        const redirectPath = localStorage.getItem("rsu_redirect") || "/";
        localStorage.removeItem("rsu_redirect");
        navigate(redirectPath);

        // Show success toast after navigation (non-blocking)
        setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "Welcome Back!",
            text: "You have successfully logged in",
            confirmButtonColor: "#667eea",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
        }, 100);
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: res.message || "Invalid credentials",
          confirmButtonColor: "#667eea",
        });
      }
    } catch (err) {
      setIsProcessing(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "An error occurred during login",
        confirmButtonColor: "#667eea",
      });
    }
  };

  const handleLoginClick = () => {
    setRememberPassword(true);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(
        localStorage.getItem("rsu_redirect")
          ? localStorage.getItem("rsu_redirect")
          : "/"
      );
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-wrapper">
              <svg
                className="login-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your RSU account</p>
          </div>

          <form className="login-form" onSubmit={SubmitLoginData}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div
                className={`input-wrapper ${
                  focusedField === "email" ? "focused" : ""
                }`}
              >
                <svg
                  className="input-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter your email"
                  className="form-input"
                  ref={refName}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  disabled={isProcessing}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div
                className={`input-wrapper ${
                  focusedField === "password" ? "focused" : ""
                }`}
              >
                <svg
                  className="input-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="form-input"
                  ref={refPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <div className="forgot-password">
                <span onClick={handleLoginClick}>Forgot password?</span>
              </div>
            </div>

            <button
              disabled={isProcessing}
              className={`login-button ${isProcessing ? "processing" : ""}`}
              type="submit"
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="arrow-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      {rememberPassword && (
        <Register setRememberPassword={setRememberPassword} />
      )}
    </div>
  );
};
export default LoginForm;
