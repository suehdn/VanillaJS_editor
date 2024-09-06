import { createStore } from "@core";
import { getDocumentId } from "@/router";

const initialState = {
  documentId: getDocumentId(),
};

export const SET_ID = "SET_ID";

export const store_documentId = createStore(
  (state = initialState, action = {}) => {
    switch (action.type) {
      case "SET_ID":
        return { ...state, documentId: action.payload };
      default:
        return state;
    }
  }
);

export const setID = (payload) => ({ type: SET_ID, payload });
