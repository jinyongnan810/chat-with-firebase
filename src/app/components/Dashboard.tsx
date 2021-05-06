import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect, useState } from "react";
import Messages from "./Messages";
import * as types from "../actions/types";
import fb from "../firebase";
const db = fb.database();
const Dashboard = () => {
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );
  const { chats } = useAppSelector((state) => state.chats);
  const dispatch = useAppDispatch();
  const [chatMsg, setChatMsg] = useState("");
  const onAddChat = async (e: any) => {
    e.preventDefault();
    const ref = db.ref(`chats/${Date.now()}`);
    console.log(ref);
    // const newItem = ref.push({ email: user!.email, msg: chatMsg });
    try {
      ref
        .set({ email: user!.email, msg: chatMsg }, (error) => {
          if (error) {
            console.error(error);
          } else {
            console.log("no error saving data.");
          }
        })
        .then(
          (success) => console.log("success"),
          (error) => console.error("error:", JSON.stringify(error))
        );
    } catch (error) {
      console.error(error);
    }

    // await newItem.set();
    setChatMsg("");
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: types.CLEAR_CHATS });
      db.ref("chats/").on("child_added", (event) => {
        dispatch({ type: types.CHAT_ADDED, payload: event.val() });
      });
      return function cleanUp() {};
    }
    // eslint-disable-next-line
  }, [loading]);
  return (
    <div>
      <Messages />
      <h1>Chats</h1>
      <div className="card col-6 p-3">
        <div className="card-title">Add Chat Message</div>
        <div className="card-body">
          <form onSubmit={onAddChat}>
            <div className="mb-3">
              <label htmlFor="chatMsg" className="form-lable">
                Chat
              </label>
              <input
                className="form-control"
                id="chatMsg"
                type="text"
                placeholder="Chat Message"
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
              />
            </div>
            <button className="btn btn-large btn-outline-success" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
      <div>
        {chats.map((c) => (
          <p key={Math.floor(Math.random() * 1000000)}>
            <b>{c.email}</b>: {c.msg}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
