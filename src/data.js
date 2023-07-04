import { request } from './api.js';

/**
 * data관련 모든 함수들 모음
 */
export default class Data {
    constructor() { }
    /**
     * get으로 파일 이름, 구조 전부 가져오는 함수
     * @returns 전체 파일 이름, 구조
     */
    getDocumentStructure = async () => {
        const getDocumentStructure = await request('', {
            method: 'GET'
        })
        return getDocumentStructure;
    }

    getDocumentContent = async (id) => {
        const getDocumentStructure = await request(`/${id}`, {
            method: 'GET'
        })
        return getDocumentStructure;
    }

    deleteDocumentStructure = async (id) => {
        const deleteDocumentStructure = await request(`/${id}`, {
            method: 'DELETE'
        })
    }

    addDocumentStructure = async (id) => {
        const addDocumentStructure = await request('', {
            method: 'POST',
            body: JSON.stringify({
                title: "새로운 페이지",
                parent: id
            })
        })
        return addDocumentStructure;
    }
} 