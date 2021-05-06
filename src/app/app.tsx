import { useEffect } from "react";
import { Router, Switch } from "react-router";
import { Provider } from "react-redux";
import store from "./store";
import { createHashHistory } from "history";

import axios from "axios";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import "./sass/index.scss";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import fb from "./firebase";
import { USER_LOADED, AUTH_EXPIRED } from "../app/actions/types";
const App = () => {
  axios.defaults.baseURL = process.env.SERVER_URL;
  axios.defaults.withCredentials = true;
  const history = createHashHistory();
  useEffect(() => {
    // store.dispatch(loadUser());
    fb.auth().onAuthStateChanged((user) => {
      if (user) {
        store.dispatch({ type: USER_LOADED, payload: user });
      } else {
        store.dispatch({ type: AUTH_EXPIRED });
      }
    });
  }, []);
  return (
    <Provider store={store}>
      <Router history={history}>
        <Header />
        <div className="container-fluid">
          <Switch>
            <PublicRoute path="/signup" component={Signup} />
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/" component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
