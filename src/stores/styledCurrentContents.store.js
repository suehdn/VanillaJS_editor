import { createStore } from "@core";

const initialState = {
  currentContents: "<div></div>",
};

export const SET_CONTENTS = "SET_CONTENTS";

export const store_currentContents = createStore(
  (state = initialState, action = {}) => {
    switch (action.type) {
      case "SET_CONTENTS":
        return { ...state, currentContents: action.payload };
      default:
        return state;
    }
  }
);

export const setCONTENTS = (payload) => ({ type: SET_CONTENTS, payload });
