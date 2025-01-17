import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebase-config";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const inputChangeHandler = (event) => {
    setLoginInput((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    await signInWithEmailAndPassword(
      auth,
      loginInput.email,
      loginInput.password
    )
      .then((userCredential) => {
        localStorage.setItem("userID", userCredential.user.uid);
        navigate("/user");
      })
      .catch((err) => {});
  };

  const loginUsingGoogle = async (event) => {
    event.preventDefault();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
        navigate("/user");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="formWarpper loginWrapper">
      <form onSubmit={formSubmitHandler}>
        <p>Login</p>
        <label htmlFor="email">E-Mail</label>
        <input
          onChange={inputChangeHandler}
          type="email"
          value={loginInput.email}
          name="email"
          autoComplete="off"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          onChange={inputChangeHandler}
          type="password"
          value={loginInput.password}
          name="password"
          autoComplete="off"
          required
        />
        <button type="submit">Login</button>
        {/* <button type="submit">{isLoading ? "Loading..." : "Login"}</button> */}
        {/* <Link to="/signup">New User? SignUp yourself</Link> */}
      </form>
      <form onSubmit={loginUsingGoogle}>
        <button type="submit">Google</button>
      </form>
      <button
        onClick={() => {
          navigate("/admin");
        }}
      >
        Enter as Admin
      </button>
    </div>
  );
};

export default Login;
