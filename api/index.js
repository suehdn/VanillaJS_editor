import fetch from "node-fetch";

const API_END_POINT = process.env.VITE_API_URL;
const USERNAME = process.env.VITE_USERNAME;

export default async function handler(req, res) {
  try {
    const response = await fetch(`${API_END_POINT}${req.query.url}`, {
      ...req.body, // options를 req.body로 전달받는다고 가정합니다.
      headers: {
        "x-username": USERNAME,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({ data });
    }

    throw new Error("API 처리중 이상이 발생했습니다.");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: error.message });
  }
}
