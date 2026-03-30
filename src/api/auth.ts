import { NextFunction, Request, Response } from "express";
import { chirpyConfig } from "../config.js";
import { checkPasswordHash, generateToken, makeJWT } from "../auth.js";
import { NewUser, RefreshToken } from "../db/schema.js";
import { insertRefreshToken } from "../db/queries/tokens.js";
import { UnauthorizedError } from "../error.js";
import { handlerGetUser } from "./users.js";
import { respondWithJSON } from "../respond.js";

const EXPIRATION_SECONDS = 3600;

type LoginResponse = Omit<NewUser & { token: string, refreshToken: string}, "hashedPassword">;

export async function handlerUserLogin(
    req: Request, 
    res: Response,
    next: NextFunction
) : Promise<void> {

    type Payload = {
        email: string,
        password: string,
    }

    const payload : Payload = req.body;

    try {
        const user = await handlerGetUser(payload.email);

        if(!user) {
            throw new UnauthorizedError("Unable to authenticate user")
        }

        const isPasswordMatch: boolean = await checkPasswordHash(
            payload.password,
            user.hashedPassword
        );

        if(!isPasswordMatch) {
            throw new UnauthorizedError("Unauthorized.");
        }

        const { hashedPassword, ...authenticatedUser } = user

        const accessToken = makeJWT(
            user.id, 
            EXPIRATION_SECONDS,
            chirpyConfig.apiConfig.jwtSecret
        )

        const refreshToken = await createRefreshToken(authenticatedUser.id);

        respondWithJSON(
            res, 
            200, 
            {
                id: authenticatedUser.id,
                createdAt: authenticatedUser.createdAt,
                updatedAt: authenticatedUser.updatedAt,
                email: authenticatedUser.email,
                token: accessToken,
                refreshToken: refreshToken.token
            } satisfies LoginResponse
        );  
    }
    catch(error) {
        next(error);
    }
}

async function createRefreshToken(userId: string): Promise<RefreshToken>{
    const token = generateToken()

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 60);

    const refreshToken = await insertRefreshToken({
        token: token,
        userId: userId,
        expiresAt: expiryDate,
    } satisfies RefreshToken);

    return refreshToken;
}