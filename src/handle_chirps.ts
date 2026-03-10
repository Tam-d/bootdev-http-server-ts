import { Request, Response, NextFunction } from "express";
import { nextTick } from "node:process";

let forbiddenWords = [
    "kerfuffle",
    "sharbert",
    "fornax"
];

export async function validateChirp(req: Request, res: Response, next: NextFunction) : Promise<void> {
    let body = req.body;

    try {
        if(!(body.body.length <= 140)) {
            throw Error("Chirp is too long");
        }
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify({"cleanedBody": sanitizeChirp(body.body)}));   
    }
    catch (error) {
        // res.set("Content-Type", "application/json");
        // res.status(400).send(
        //     JSON.stringify({"error": (error as Error).message})
        // );
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