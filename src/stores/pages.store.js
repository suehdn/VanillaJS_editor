import { createStore } from "@core";
import { getItem } from "@stores";

const initialState = {
  pages: {
    pages: [],
    openedDetail: new Set(getItem("openedDetail", [])),
    selected: getItem("selected") || null,
  },
};

export const SET_PAGES = "SET_PAGES";

export const store_pages = createStore((state = initialState, action = {}) => {
  switch (action.type) {
    case "SET_PAGES":
      return { ...state, pages: { ...state.pages, ...action.payload } };
    default:
      return state;
  }
});

export const setPAGES = (payload) => ({ type: SET_PAGES, payload });
