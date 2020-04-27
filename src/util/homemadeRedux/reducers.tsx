import {
  messageActionTypes,
  ICentralStore,
  IMessage,
  IAction,
  ActionTypes,
} from "types";
import { getCardSizeByWindowSize } from "util/cardSizeBreakpoints";

const messageReducer = (
  state: ICentralStore,
  action: messageActionTypes
): ICentralStore => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.RemoveMessage:
      return {
        ...state,
        messages: state.messages.filter((m) => m.id !== payload),
      };
    case ActionTypes.AddMessage:
      return {
        ...state,
        messages: [...state.messages, payload as IMessage],
      };
    case ActionTypes.ClearAllMessages:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

const resizeReducer = (
  state: ICentralStore,
  action: IAction<number[]>
): ICentralStore => {
  const { type, payload } = action;
  switch (type) {
    case ActionTypes.ResizeCards:
      return {
        ...state,
        cardSize: getCardSizeByWindowSize(payload),
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
  toReturn = resizeReducer(state, action);
  // call other reducers, if there will be any
  return toReturn;
};
