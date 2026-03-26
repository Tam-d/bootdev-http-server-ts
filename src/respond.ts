import { Response } from "express";

export function respondWithJSON(res: Response, statusCode: number, payload: any) {
    res.header("Content-Type", "application/json");
    const body = JSON.stringify(payload);
    res.status(statusCode).send(body);
}

export function respondWithError(
    res: Response, 
    errorCode: number, 
    errorMsg: string
) {
    respondWithJSON(res, errorCode, errorMsg);
}