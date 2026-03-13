import { Request, Response, NextFunction } from "express";
import { Error400, Error500 } from "../error.js";
import { createChirp, deleteAllChirps } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";


export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) : Promise<void> {
    const payload = req.body;
    
    try {
        const newChirp: NewChirp = {
            body: validateChirp(payload.body),
            user_id: payload.userId
        }

        const chirp = await createChirp(newChirp);

        if(chirp === undefined) {
            throw new Error500(`Failed to create chirp`);
        }
        
        res.status(201);
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(
            {
                "id": chirp.id,
                "createdAt": chirp.createdAt,
                "updatedAt": chirp.updatedAt,
                "body": chirp.body,
                "userId": chirp.user_id
            }
        ));  
    }
    catch(error) {
        console.log((error as Error).message);
        console.log((error as Error).cause);
        next(error);
    }
}

export async function handlerDeleteChirps() {
    await deleteAllChirps()
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