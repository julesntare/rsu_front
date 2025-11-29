import React, { useRef, useState} from "react";
import "./Register.scss";
import Logo from "../../assets/logo/urLogo.png";

export default function Register({setRememberPassword}){
  const [showVerified, setShowVerified] = useState(false);
  const emailRef = useRef();
  const SubmitLoginData = (e)=>{
    e.preventDefault();
    const email = emailRef.current.value;
    console.log({email: email} );
    if(email === "" ){
      alert("Fill in your Email plz!")
    }else{
      setShowVerified(true)
      setTimeout(()=>
      setShowVerified(false)
      , 2000);
    }
  }
  const handleRegisterClick = ()=>{
    setRememberPassword(false)
  }
  return(
      <div className="row d-flex register flex-column justify-content-start align-items-center">
          <div className="col-12 col-md-6 p-4">
            <div className="text-primary d-flex w-100 fw-bold h2 justify-content-center align-items-center mb-4">
             { showVerified &&<p className="  verified p-2 px-3 position-fixed end-0 me-2 t-0 text-white fw-bold fs-md bg-success">
                <i className="bi bi-check2-all"></i>
                Check your Email
               </p>}
              <img 
              src={Logo} 
              className="me-2"
               width="50px"
              height ="50px" 
              />
              <h1 className="fw-bold">RSU</h1>
            </div>
            <div className="cover px-5 border">
              <p className="text-primary fw-bold my-3">Enter your Email to send you the password Reset</p>
              <form className="d-flex align-items-center container form-login p-4 flex-column border" onSubmit={SubmitLoginData}>
                  <input type="email" placeholder="Email"  className="my-2 w-100  "  ref={emailRef} />
                  <button className="btn my-2 login-btn" type="submit">Send</button>
              </form>
              <div className="password-reset mt-3 px-4 mb-5 w-100 text-primary fw-bold">
                  <p className="ms-2"> Got password?<span  onClick={handleRegisterClick} className="text-success ms-2">Back to login</span></p>
              </div>
            </div>
          </div>
        </div>
  )
}
