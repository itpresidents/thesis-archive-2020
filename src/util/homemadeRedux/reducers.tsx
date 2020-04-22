import { messageActionTypes, ICentralStore, IMessage, IAction } from "types";
import { REMOVE_MESSAGE, CLEAR_ALL_MESSAGES, ADD_MESSAGE } from "./actions";

const messageReducer = (
  state: ICentralStore,
  action: messageActionTypes
): ICentralStore => {
  const { type, payload } = action;
  // console.log(action)
  switch (type) {
    case REMOVE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== payload),
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload as IMessage],
      };
    case CLEAR_ALL_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

export const rootReducer = (
  state: ICentralStore,
  action: IAction<any>
): ICentralStore => {
  let toReturn = messageReducer(state, action);
  // call other reducers, if there will be any
  return toReturn;
};
