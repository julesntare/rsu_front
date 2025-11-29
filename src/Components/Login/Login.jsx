import React, { useState, useRef, useEffect } from "react";
import "./Login.scss";
import Register from "../Register/Register";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const refName = useRef();
  const refPassword = useRef();
  const [rememberPassword, setRememberPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated, login } = useAuth();

  const SubmitLoginData = (e) => {
    e.preventDefault();
    const UserName = refName.current.value;
    const Password = refPassword.current.value;
    if (Password === "" || UserName === "") {
      // add toast alert danger
      toast.error("Please enter your username and password", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setIsProcessing(true);
      login(UserName, Password)
        .then((res) => {
          setIsProcessing(false);
          if (res.isAuthenticated) {
            // add toast alert success
            toast.success("You have successfully logged in!", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            // add redirect to home page
            navigate(
              localStorage.getItem("rsu_redirect")
                ? localStorage.getItem("rsu_redirect")
                : "/"
            );
            localStorage.removeItem("rsu_redirect");
          } else {
            // add toast alert danger
            toast.error("Invalid credentials", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((err) => {
          setIsProcessing(false);
          // add sweet alert danger
          toast.error(err.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
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
    <div className="row d-flex login flex-column justify-content-start align-items-center">
      <div className="col-12 col-md-6 p-4">
        <div className="cover px-5 border">
          <h1 className="text-dark w-100 fw-bold h2 text-center my-3">
            RSU Authentication
          </h1>
          <h3 className="text-primary fw-bold my-2"></h3>
          <form
            className="d-flex align-items-center container  p-4 flex-column "
            onSubmit={SubmitLoginData}
          >
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <input
              type="text"
              placeholder="Email"
              className="my-2 w-100"
              ref={refName}
            />
            <input
              type="password"
              placeholder="Password"
              className="my-2 w-100"
              ref={refPassword}
            />
            <button
              disabled={isProcessing}
              className="btn w-100 my-2 login-btn"
            >
              Login
            </button>
          </form>
          <div className="password-reset mt-3 px-4 mb-5 w-100 text-primary fw-bold">
            <p className="ms-2">
              <span onClick={handleLoginClick}>Forgot password?</span>
            </p>
          </div>
        </div>
        {rememberPassword && (
          <Register setRememberPassword={setRememberPassword} />
        )}
      </div>
    </div>
  );
};
export default LoginForm;
