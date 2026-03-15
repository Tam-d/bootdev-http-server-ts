import { Request, Response, NextFunction } from "express";
import { Error400, InternalServerError } from "../error.js";
import { NewChirp } from "../db/schema.js";
import { createChirp, getChirps } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const payload = req.body;
    
    try {
        const newChirp: NewChirp = {
            body: validateChirp(payload.body),
            userId: payload.userId
        }

        const chirp = await createChirp(newChirp);

        if(chirp === undefined) {
            throw new InternalServerError(`Failed to create chirp`);
        }
        
        res.status(201);
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(
            chirp
        ));  
    }
    catch(error) {
        console.log((error as Error).message);
        console.log((error as Error).cause);
        next(error);
    }
}

export async function handlerGetChirps(req: Request, res: Response, next: NextFunction) : Promise<void>{
    try {
        const chirps: NewChirp[] = await getChirps();

        if(chirps === undefined || chirps.length === 0) {
            throw new InternalServerError("Internal error while retrieving chirps.");
        }

        res.status(200);
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(
            chirps
        ));
    }
    catch(error) {
        next(error);
    }
}

function validateChirp(chirp: string) : string {
    if(!(chirp.length <= 140)) {
        throw new Error400("Chirp is too long. Max length is 140");
    }
    return sanitizeChirp(chirp)
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