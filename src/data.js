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
} 