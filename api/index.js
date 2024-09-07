import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const API_END_POINT = process.env.VITE_API_URL;
const USERNAME = process.env.VITE_USERNAME;

export default async function handler(req, res) {
  const { id } = req.query;
  const url = id ? `/${id}` : req.url.replace("/api/index", "");

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "x-username": USERNAME,
        "Content-Type": "application/json",
      },
    };

    if (req.method !== "GET") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const fetchUrl = `${API_END_POINT}${url}`;
    const response = await fetch(fetchUrl, fetchOptions);
    const responseText = await response.text();

    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        return res.status(200).json({ data });
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError.message);
        throw new Error("응답 데이터 파싱 중 이상이 발생했습니다.");
      }
    } else {
      console.error("Response not OK:", responseText);
      return res.status(response.status).json({ message: responseText });
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
    return res.status(500).json({ message: error.message });
  }
}
