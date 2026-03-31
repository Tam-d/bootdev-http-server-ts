import { Request, Response, NextFunction } from "express";
import { chirpyConfig } from "../config.js";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "../error.js";
import { NewChirp } from "../db/schema.js";
import { createChirp, deleteChirp, getChirp, getChirps, getChirpsByAuthorId } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { respondWithJSON } from "../respond.js";
import { a, b } from "vitest/dist/chunks/suite.d.udJtyAgw.js";

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
            throw new NotFoundError("The requested resource does not exist");
        }

        respondWithJSON(res, 200, chirp);
    }
    catch(error) {
        next(error);
    }
}

export async function handlerGetChirps(req: Request, res: Response, next: NextFunction) : Promise<void>{
    try {
        let authorId = req.query.authorId;
        let sortBy = req.query.sort;

        console.log("AuthorId: ", authorId);

        let chirps: NewChirp[] = [];

        if(!authorId || authorId === "") {
            chirps = await getChirps();
        }
        else {
            chirps = await getChirpsByAuthorId(authorId as string);
        }

        if(chirps === undefined || chirps.length === 0) {
            throw new InternalServerError("Internal error while retrieving chirps.");
        }

        if(sortBy === 'asc') {

            
            chirps = chirps.sort((a,b) => {
                if(a.createdAt === undefined || b.createdAt === undefined) {
                    throw new InternalServerError("Unable to sort");
                }
                if(a.createdAt < b.createdAt) {
                    return -1
                }
                if(a.createdAt > b.createdAt) {
                    return 1;
                }
                return 0
            });
        }
        else if (sortBy === 'desc') {
            chirps = chirps.sort((a,b) => {
                if(a.createdAt === undefined || b.createdAt === undefined) {
                    throw new InternalServerError("Unable to sort");
                }
                if(a.createdAt < b.createdAt) {
                    return 1
                }
                if(a.createdAt > b.createdAt) {
                    return -1;
                }
                return 0
            });
        }

        respondWithJSON(res, 200, chirps);
    }
    catch(error) {
        next(error);
    }
}

export async function handlerDeleteChirp(
    req: Request, 
    res: Response, 
    next: NextFunction) : Promise<void>{

    try {
        const accessToken = getBearerToken(req);
        const userId = validateJWT(
            accessToken, 
            chirpyConfig.apiConfig.jwtSecret
        )

        if(!userId) {
            throw new UnauthorizedError("Unauthenticated users may not post, please login");
        }

        const chirpId = req.params.chirpId;

        if(typeof chirpId !== "string") {
            throw new BadRequestError("Invalid chirp Id");
        }

        const chirp = await getChirp(chirpId);

        console.log("the chirp: ", chirp);

        if(chirp === undefined) {
            throw new NotFoundError("The requested resource does not exist");
        }

        if(chirp.userId !== userId) {
            throw new ForbiddenError("User does not own resource");
        }

        const deletedChirp = await deleteChirp(chirpId, userId);

        res.status(204).send();

    }
    catch(error) {
        next(error);
    }


    
}

function validateChirp(chirp: string) : string {
    if(!(chirp.length <= 140)) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
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