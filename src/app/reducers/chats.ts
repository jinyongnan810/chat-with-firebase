import { Reducer } from "redux";
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
  payload: ChatInfo | null;
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
        chats: [...state.chats, payload as ChatInfo],
      };
    case types.CLEAR_CHATS:
      return {
        chats: [],
      };
    default:
      return state;
  }
};
export default chatsReducer;
