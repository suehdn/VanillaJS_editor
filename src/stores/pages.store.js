import { createStore } from "@core";
import Data from "@/data";

const data = new Data();

const initialState = {
  x: 100,
  y: 200,
};

export const SET_X = "SET_X";
export const SET_Y = "SET_Y";

export const store = createStore((state = initialState, action = {}) => {
  switch (action.type) {
    case "SET_X":
      return { ...state, x: action.payload };
    case "SET_Y":
      return { ...state, y: action.payload };
    default:
      return state;
  }
});

export const setX = (payload) => ({ type: SET_X, payload });
export const setY = (payload) => ({ type: SET_Y, payload });
