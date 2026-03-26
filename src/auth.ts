import * as argon2 from "argon2";
import { Request } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { InternalServerError, UnauthorizedError} from "./error.js";

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

const ISSUER = "chirpy";


export async function hashPassword(password: string): Promise<string> {
    try {
        return await argon2.hash(password);
    } 
    catch (error) {
        throw new InternalServerError("Error in hashing");
    }
}

export async function checkPasswordHash(
    password: string, 
    hash: string
): Promise<boolean> {
    try {
        return await argon2.verify(hash, password);
    } 
    catch (error) {
        throw new InternalServerError("Unable to verify");
    }
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const iat = Math.floor(Date.now() / 1000);
    const eat = iat + expiresIn;

    const jwtPayload : Payload = {
        "iss": ISSUER,
        "sub": userID,
        "iat": iat,
        "exp": eat
    }

    return jwt.sign(jwtPayload satisfies Payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    let jwtPayload: Payload;

    try {
        jwtPayload = jwt.verify(tokenString, secret) as Payload
    }
    catch(error) {
        throw new UnauthorizedError("Token is invalid");
    }

    if (jwtPayload.iss !== ISSUER) {
        throw new UnauthorizedError("Invalid issuer");
    }

    if (!jwtPayload.sub) {
        throw new UnauthorizedError("No user ID in token");
    }
    
    return jwtPayload.sub;
}

export function getBearerToken(req: Request): string {
    const authHeader = req.headers.authorization;

    if(authHeader === "" || authHeader === null || authHeader === undefined) {
        throw new UnauthorizedError("No token found");
    }

    return authHeader.split(" ")[1];
}