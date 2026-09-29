import {AiAnalysis, AiAnswerPayload, AiPillarSnapshot, ScaleLabelType} from "./Types.ts";

export interface SaveResults {
    totalScore: number;
    level: ScaleLabelType;
    answers: number[];
}

export interface SaveEventResults {
    roomCode: string | null;
    nickname: string;
    totalScore: number;
    level: ScaleLabelType;
    answers: number[];
}

export interface EmailFormRequest {
    name: string;
    surname: string;
    email: string;
    phoneNumber: string;
    message: string;
}

export interface AiComparisonRequest {
    totalScore: number;
    classicLevel: ScaleLabelType;
    responses: AiAnswerPayload[];
    pillars: AiPillarSnapshot[];
}

export type AiComparisonResponse = AiAnalysis;
