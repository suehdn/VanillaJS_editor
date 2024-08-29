import { areEqual } from "@utils";

let currentObserver = null;

const subscribable = (object) => {
  const observers = {};

  return new Proxy(object, {
    get(target, key) {
      observers[key] = observers[key] || new Set();
      if (currentObserver) observers[key].add(currentObserver);
      return target[key];
    },
    set(target, key, value) {
      if (areEqual(target[key], value)) return true; //값이 동일하면 넘어가기
      target[key] = value;
      console.log("2", target, key, value, observers);
      observers[key].forEach((func) => func());
      return true;
    },
  });
};

export const createStore = (reducer) => {
  const state = subscribable(reducer());

  const immovableState = {};
  Object.keys(state).forEach((key) => {
    Object.defineProperty(immovableState, key, {
      get: () => state[key],
    });
  });

  const dispatch = (action) => {
    const newState = reducer(state, action);
    console.log(newState);

    for (const [key, value] of Object.entries(newState)) {
      if (!state[key]) continue;
      console.log(key, state[key], "1");
      state[key] = value;
    }
  };

  const getState = () => immovableState;

  const subscribe = (func) => {
    currentObserver = func;
    func();
    currentObserver = null;
  };

  return { subscribe, getState, dispatch };
};
