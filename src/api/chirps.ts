import { Request, Response, NextFunction } from "express";
import { chirpyConfig } from "../config.js";
import { Error400, InternalServerError, UnauthorizedError } from "../error.js";
import { NewChirp } from "../db/schema.js";
import { createChirp, getChirp, getChirps } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { respondWithJSON } from "../respond.js";

export async function handlerCreateChirp(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const token = getBearerToken(req);
        const userId = validateJWT(token, chirpyConfig.apiConfig.jwtSecret)
        if(!userId) {
            throw new UnauthorizedError("Unauthenticated users may not post, please login");
        }

        const payload = req.body;

        const newChirp: NewChirp = {
            body: validateChirp(payload.body),
            userId: userId
        }

        const chirp = await createChirp(newChirp);

        if(chirp === undefined) {
            throw new InternalServerError(`Failed to create chirp`);
        }
        
        respondWithJSON(res, 201, chirp);
    }
    catch(error) {
        console.log((error as Error).message);
        console.log((error as Error).cause);
        next(error);
    }
}

export async function handlerGetChirp(req: Request, res: Response, next: NextFunction) : Promise<void>{
    try {
        const chirpId = req.params.chirpId;

        const chirp: NewChirp = await getChirp(chirpId as string);

        if(chirp === undefined) {
            throw new InternalServerError("Internal error while retrieving chirps.");
        }

        respondWithJSON(res, 200, chirp);
    }
    catch(error) {
        next(error);
    }
}

export async function handlerGetChirps(req: Request, res: Response, next: NextFunction) : Promise<void>{
    try {
        const chirps: NewChirp[] = await getChirps();

        if(chirps === undefined || chirps.length === 0) {
            throw new InternalServerError("Internal error while retrieving chirps.");
        }

        respondWithJSON(res, 200, chirps);
    }
    catch(error) {
        next(error);
    }
}

function validateChirp(chirp: string) : string {
    if(!(chirp.length <= 140)) {
        //TODO: update error code
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