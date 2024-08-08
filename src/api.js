const API_END_POINT = import.meta.env.VITE_API_URL;
const USERNAME = import.meta.env.VITE_USERNAME;

export const request = async (url = "", options = {}) => {
  try {
    const res = await fetch(`${API_END_POINT}${url}`, {
      ...options,
      headers: {
        "x-username": USERNAME,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      return await res.json();
    }
    throw new Error("API 처리중 이상이 발생했습니다.");
  } catch (event) {
    alert(event.message);
    window.location = "https://vanilla-js-editor.vercel.app/";
  }
};
