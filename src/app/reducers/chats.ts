import { AnyAction, Reducer } from "redux";
import * as types from "../actions/types";
interface ChatInfo {
  email: string;
  msg: string;
}
interface ChatsInfo {
  chats: ChatInfo[];
}
interface ChatsBaseAction {
  type: string;
  payload: ChatInfo;
}
const initialState: ChatsInfo = {
  chats: [],
};
const chatsReducer: Reducer<ChatsInfo, ChatsBaseAction> = (
  state: ChatsInfo = initialState,
  action: ChatsBaseAction
) => {
  const { type, payload } = action;
  switch (type) {
    case types.CHAT_ADDED:
      return {
        chats: [...state.chats, payload],
      };
    default:
      return state;
  }
};
export default chatsReducer;
export { ChatsInfo };
