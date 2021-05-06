import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../actions/auth";
import Messages from "../Messages";
import * as types from "../../actions/types";
import firebase from "firebase/app";
import fb from "../../firebase";
import { showMessages } from "../../../app/actions/messages";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const dispatch = useAppDispatch();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  const signinWithGoogle = (e: any) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    fb.auth()
      .signInWithPopup(provider)
      .then((result) => {
        const credential = result.credential!;
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = (credential as any).accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user);
        dispatch({ type: types.LOGIN_SUCCESS, payload: user });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
        console.error(errorMessage);
        dispatch(showMessages("warning", [{ message: errorMessage }]));
      });
  };
  return (
    <div className="card col-6 p-3 position-absolute top-50 start-50 translate-middle">
      <div className="card-title">Log In</div>
      <div className="card-body">
        <button className="btn btn-primary" onClick={signinWithGoogle}>
          Sign In With Google
        </button>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-lable">
              Email
            </label>
            <input
              className="form-control"
              id="email"
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-lable">
              Password
            </label>
            <input
              className="form-control"
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Messages />
          <button className="btn btn-large btn-outline-success" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
