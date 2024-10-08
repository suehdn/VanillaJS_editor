const storage = window.localStorage;

export const setItem = (key, value) => {
  try {
    if (typeof value === "object") {
      storage.setItem(key, JSON.stringify([...value]));
    } else storage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
};

export const getItem = (key, defaultValue) => {
  try {
    const storedValue = storage.getItem(key);
    if (!storedValue) {
      return defaultValue;
    }
    const parsedValue = JSON.parse(storedValue);
    return parsedValue;
  } catch {
    return defaultValue;
  }
};

export const removeItem = (key) => {
  storage.removeItem(key);
};
