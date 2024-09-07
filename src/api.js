export const request = async (url = "", options = {}) => {
  try {
    const fullUrl = `/api${url}`;
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });

    const responseText = await res.text();

    if (res.ok) {
      if (responseText) {
        try {
          const data = JSON.parse(responseText);
          return data;
        } catch (jsonError) {
          console.error("JSON parsing error:", jsonError.message);
          throw new Error("응답 데이터 파싱 중 이상이 발생했습니다.");
        }
      } else {
        throw new Error("빈 응답을 받았습니다.");
      }
    } else {
      console.error(`Error response: ${responseText}`);
      throw new Error(`API 요청 실패: ${res.status} - ${responseText}`);
    }
  } catch (event) {
    console.error("Error occurred:", event.message);
    alert(event.message);
    window.location.href = "/main";
  }
};
