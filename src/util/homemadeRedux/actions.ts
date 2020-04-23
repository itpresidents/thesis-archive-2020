import { IMessage, IAction, ActionTypes } from "types";
import randomId from "util/generateRandomId";

export const addMessageAction = (
  text: string,
  autoDisappear: boolean = true
): IAction<IMessage> => ({
  type: ActionTypes.AddMessage,
  payload: { text, id: randomId(), autoDisappear },
});

export const clearAllMessagesAction = (): IAction => ({
  type: ActionTypes.ClearAllMessages,
  payload: null,
});

export const removeMessageAction = (
  messageId: IMessage["id"]
): IAction<IMessage["id"]> => ({
  type: ActionTypes.RemoveMessage,
  payload: messageId,
});
