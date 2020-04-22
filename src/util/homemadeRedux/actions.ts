import { IMessage, IAction } from "types";
import randomId from "util/generateRandomId";

export const ADD_MESSAGE = "ADD_MESSAGE";
export const addMessageAction = (
  text: string,
  autoDisappear: boolean = true
): IAction<IMessage> => ({
  type: ADD_MESSAGE,
  payload: { text, id: randomId(), autoDisappear },
});

export const CLEAR_ALL_MESSAGES = "CLEAR_ALL_MESSAGES";
export const clearAllMessagesAction = (): IAction => ({
  type: CLEAR_ALL_MESSAGES,
  payload: null,
});

export const REMOVE_MESSAGE = "REMOVE_MESSAGE";
export const removeMessageAction = (
  messageId: IMessage["id"]
): IAction<IMessage["id"]> => ({
  type: REMOVE_MESSAGE,
  payload: messageId,
});
