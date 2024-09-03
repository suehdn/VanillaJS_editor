import { executeWithTryCatch } from "./utils";

const ROUTE_CHANGE_EVENT_NAME = "route-change";

export const initRouter = (onRoute) => {
  window.addEventListener(ROUTE_CHANGE_EVENT_NAME, (e) => {
    const { nextUrl } = e.detail;

    if (nextUrl) {
      history.pushState(null, null, nextUrl);
      onRoute();
    }
  });
};

export const push = async (nextUrl) => {
  await executeWithTryCatch(() => {
    if (
      nextUrl === "/main" ||
      nextUrl === "/quick_start" ||
      nextUrl === "/guestbook" ||
      nextUrl.split("/")[1] * 1
    ) {
      window.dispatchEvent(
        new CustomEvent(ROUTE_CHANGE_EVENT_NAME, {
          detail: {
            nextUrl,
          },
        })
      );
    } else throw new Error("Invalid URL pushed");
  }, "Error push router");
};

export const getDocumentId = () => {
  const urlList = window.location.href.split("/");
  return urlList[urlList.length - 1];
};
