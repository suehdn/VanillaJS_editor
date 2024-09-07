import { request } from "./api.js";

/**
 * data관련 모든 함수들 모음
 */
export default class Data {
  constructor() {}
  getDocumentStructure = async () => {
    const getDocumentStructure = await request("/index", {
      method: "GET",
    });
    return getDocumentStructure;
  };

  getDocumentContent = async (id) => {
    const getDocumentStructure = await request(`/index/${id}`, {
      method: "GET",
    });
    return getDocumentStructure;
  };

  deleteDocumentStructure = async (id) => {
    const deleteDocumentStructure = await request(`/index/${id}`, {
      method: "DELETE",
    });
  };

  addDocumentStructure = async (id = null) => {
    const addDocumentStructure = await request("/index", {
      method: "POST",
      body: JSON.stringify({
        title: "",
        parent: id,
      }),
    });
    return addDocumentStructure;
  };

  editDocument = async (id, title, content) => {
    if (!title) {
      title = "";
    }
    const editDocument = await request(`/index/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
    return this.getDocumentStructure();
  };
}
