import { NextFunction, Request, Response } from "express";
import { chirpyConfig } from "../config.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { UnauthorizedError } from "../error.js";
import { handlerGetUser } from "./users.js";
import { respondWithJSON } from "../respond.js";

export async function handlerUserLogin(
    req: Request, 
    res: Response,
    next: NextFunction
) : Promise<void> {

    type RequestBody = {
        email: string,
        password: string,
        expiresInSeconds?: number
    }

    type SanitizedUser = Omit<NewUser, "hashedPassword">;
    
    const reqBody : RequestBody = req.body;
    let expiration = 3600;

    try {
        if( reqBody.email === undefined || typeof reqBody.email !== "string") {
            throw new UnauthorizedError("Invalid or empty email");
        }
        if( reqBody.password === undefined || typeof reqBody.password !== "string") {
            throw new UnauthorizedError("Invalid or empty password");
        }
        if(reqBody.expiresInSeconds && reqBody.expiresInSeconds < expiration) {
            expiration = reqBody.expiresInSeconds;
        } 

        const existingUser: NewUser = await handlerGetUser(reqBody.email);

        if(existingUser && existingUser.id) {
            const jwtToken = makeJWT(
                existingUser.id, 
                expiration, 
                chirpyConfig.apiConfig.jwtSecret
            )

            if(existingUser.hashedPassword) {
                const isPasswordMatch: boolean = await checkPasswordHash(
                    reqBody.password,
                    existingUser.hashedPassword
                );

                if(isPasswordMatch === false) {
                    console.log("Password match false!")
                    throw new UnauthorizedError("Unauthorized.");
                }

                const { hashedPassword, ...sanitizedUser } = existingUser

                const user : SanitizedUser = sanitizedUser;

                respondWithJSON(
                    res, 
                    200, 
                    {
                        id: user.id,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        email: user.email,
                        token: jwtToken
                    }
                );
            } 
        }
    }
    catch(error) {
        next(error);
    }
}