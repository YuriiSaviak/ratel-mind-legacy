import axios, {AxiosInstance} from "axios";
import {AiComparisonRequest, EmailFormRequest, SaveEventResults, SaveResults} from "../types/ApiTypes.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiInstance: AxiosInstance = axios.create({
   baseURL: API_BASE_URL
});

export const api = {
    results: {
        save: (data: SaveResults)=> apiInstance.post('/api/results', data)
    },
    eventResults: {
        save: (data: SaveEventResults)=> apiInstance.post('/api/event-results', data)
    },
    emailForms: {
        send: (data: EmailFormRequest)=> apiInstance.post('/api/email-forms', data)
    },
    aiAnalysis: {
        compare: (data: AiComparisonRequest)=> apiInstance.post('/api/ai/compare', data)
    }
};
