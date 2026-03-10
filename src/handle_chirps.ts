import { Request, Response, NextFunction } from "express";
import { nextTick } from "node:process";
import { Error400 } from "./error.js";

let forbiddenWords = [
    "kerfuffle",
    "sharbert",
    "fornax"
];

export async function validateChirp(req: Request, res: Response, next: NextFunction) : Promise<void> {
    let body = req.body;

    try {
        if(!(body.body.length <= 140)) {
            throw new Error400("Chirp is too long. Max length is 140");
        }
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify({"cleanedBody": sanitizeChirp(body.body)}));   
    }
    catch (error) {
        next(error);
    }
}

function sanitizeChirp(chirp: string) {
    console.log(`The original chirp: ${chirp}`);
    
    let sanitizedChirp = chirp.replace(
        /\b(kerfuffle|sharbert|fornax)\b/gi, 
        "****"
    );

    console.log(`The sanitized chirp: ${sanitizedChirp}`);
    return sanitizedChirp;
}