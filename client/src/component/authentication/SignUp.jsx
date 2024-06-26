import { useRef, useState } from "react";
import { provider, auth } from "./firebaseConfig";
import {
  sendSignInLinkToEmail,
  createUserWithEmailAndPassword,
  signInWithPopup,
  deleteUser
} from "firebase/auth";
import "./style.scss";

import { FcGoogle } from "react-icons/fc";


const SignUp = ({ setState }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errMessage, setErrMessage] = useState("")
  const googleref = useRef(null);

  const singInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((data) => {
        console.log("successfull sign up:",data)
      })
      .catch((err) => {
        alert("Something Went Wrong",err.message)
    
      });
  };
  const sendLink = () => {
    const user = auth.currentUser;
    if (!user) return;
    sendEmailVerification(user)
      .then(() => {       
        console.log("email verification link sent:");
      })
      .catch((error) => {
        console.log(
          "error on sending verification link:",
          "message:",
          error.message,
          "code:",
          error.code
        );
      });
  };

  const signup = (e) => {
    e.preventDefault();
    if (userName.length == 0 || password.length < 6 || email.length == 0) {
      if (password.length < 6) {
        // alert("Password Cannot Be Less Than 6 Digits");
        setErrMessage("Password Cannot Be Less Than 6 Digits");
        setTimeout(() => {
          setErrMessage("")
        }, 5000);
      } else alert("Please Provdie Necessary Details");
    } else {
      createUserWithEmailAndPassword(auth,email,password)
      .then((userCredential)=>{
        console.log("User is created successfully:",userCredential);
        sendLink();
        setState("Sign In")
      })
      .catch((error)=>{
        console.log("Error on creating user:","message:", error.message,"code:",error.code)
        setErrMessage(error.message);
        setTimeout(() => {
          setErrMessage("")
        }, 5000);
      })
    }
  };

  const handleChange = (event) => {
    if (event.target.name === "email") setEmail(event.target.value);
    else if (event.target.name === "password") setPassword(event.target.value);
    else setUserName(event.target.value);
  };

  return (
    <div className="wrapper">
      <h3>Sign Up</h3>
      <form onSubmit={signup} className="form">
        <input
          className="input"
          type="text"
          placeholder="Username"
          name="userName"
          value={userName}
          onChange={handleChange}
        />
        <input
          className="input"
          type="Email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <input
          className="input"
          type="Password"
          placeholder="Password"
          value={password}
          name="password"
          onChange={handleChange}
        />
        <p className="privacy">By creating or accessing an account on this website you agree with our <a href="https://nau-27r.github.io/privacy-policy/" >Privacy Policy</a><br />
        <a href="https://nau-27r.github.io/refund-policy/" >Refund Policy</a>, {     }
        <a href="https://nau-27r.github.io/terms-conditions/" >Terms and Conditions</a></p>
        <button onClick={signup} className="btn" type="submit">
          Sign Up
        </button>
        <p className="errorMessage">{errMessage}</p>
      </form>
      <hr className="line" />
      <span className="google" onClick={singInWithGoogle} ref={googleref}>
        <FcGoogle size={25} className="icon" />
        Sign Up With Google
      </span>
      <span className="sign">
        Already have an account?{" "}
        <span
          className="setState"
          onClick={() => {
            setState("Sign In");
          }}
        >
          Sign In
        </span>{" "}
      </span>
    </div>
  );
};

export default SignUp;
