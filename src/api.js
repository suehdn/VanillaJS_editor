export const API_END_POINT = "https://kdt-frontend.programmers.co.kr/documents"

export const request = async (url = "", options = {}) => {
    try {
        const res = await fetch(`${API_END_POINT}${url}`, {
            ...options,
            headers: {
                'x-username': 'hyesu',
                'Content-Type': 'application/json',
            }
        })

        if (res.ok) {
            return await res.json();
        }

        throw new Error('API 처리중 이상이 발생했습니다.');
    } catch (event) {
        alert(event.message);
        window.location = "https://fedc-4-5-project-notion-vanilla-js-rosy.vercel.app"
    }
}
