import { combineReducers } from "redux";
import auth from "./auth";
import messages from "./messages";
import chats from "./chats";
export default combineReducers({ auth, messages, chats });
