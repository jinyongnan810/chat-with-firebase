import { Action, AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { showMessages } from "./messages";
import * as types from "./types";
import fb from "../firebase";
import firebase from "firebase";
const auth = fb.auth();
const fstore = fb.firestore();

export const loadUser =
  (): ThunkAction<void, Object, unknown, AnyAction> =>
  async (dispatch: Dispatch<Action>) => {
    try {
      if (auth.currentUser) {
        dispatch({
          type: types.USER_LOADED,
          payload: auth.currentUser,
        });
      } else {
        dispatch({
          type: types.AUTH_EXPIRED,
        });
      }
    } catch (error) {
      dispatch({
        type: types.AUTH_EXPIRED,
      });
    }
  };

export const login =
  (
    email: string,
    password: string
  ): ThunkAction<void, Object, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      // const res = await axios.post(
      //   "/api/users/signin",
      //   { email, password },
      //   jsonConfig
      // );

      const credential = await auth.signInWithEmailAndPassword(email, password);
      console.log(credential);
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: credential.user,
      });
    } catch (error) {
      console.error(error);
      // dispatch(showMessages("warning", error.response.data.errors));
      dispatch(showMessages("warning", [{ message: error.message }]));
    }
  };

export const signup =
  (
    email: string,
    password: string
  ): ThunkAction<void, Object, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      // const res = await axios.post(
      //   "/api/users/signup",
      //   { email, password },
      //   jsonConfig
      // );
      const credential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      dispatch(registerToFirestore(credential));

      dispatch({
        type: types.SIGNUP_SUCCESS,
        payload: credential.user,
      });
      dispatch(
        showMessages("info", [{ message: `Dear ${email},Welcome!` }], true)
      );
    } catch (error) {
      console.error(error);
      // dispatch(showMessages("warning", error.response.data.errors));
      dispatch(showMessages("warning", [{ message: error.message }]));
    }
  };
export const registerToFirestore =
  (
    credential: firebase.auth.UserCredential
  ): ThunkAction<void, Object, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const existedRegister = await fstore
        .doc(`user/${credential.user!.uid}`)
        .get();
      if (existedRegister.exists) {
        return;
      }

      await fstore.doc(`user/${credential.user!.uid}`).set({
        uid: credential.user!.uid,
        email: credential.user!.email,
        name: credential.user!.email!.split("@")[0],
      });
    } catch (error) {
      console.error(error);
      // dispatch(showMessages("warning", error.response.data.errors));
      dispatch(showMessages("warning", [{ message: error.message }]));
    }
  };

export const logout =
  (): ThunkAction<void, Object, unknown, AnyAction> => async (dispatch) => {
    try {
      // axios.post("/api/users/signout");
      await auth.signOut();
      dispatch({
        type: types.LOGOUT,
      });
    } catch (error) {
      dispatch({
        type: types.AUTH_EXPIRED,
      });
    }
    // dispatch(clearMessages());
  };
