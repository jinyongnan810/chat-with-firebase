import { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { login, registerToFirestore } from "../../actions/auth";
import Messages from "../Messages";
import * as types from "../../actions/types";
import firebase from "firebase/app";
import fb from "../../firebase";
import { showMessages } from "../../../app/actions/messages";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const user = result.user;
        console.log(user);
        dispatch(registerToFirestore(result));
        dispatch({ type: types.LOGIN_SUCCESS, payload: user });
      })
      .catch((error) => {
        const errorMessage = error.message;
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
