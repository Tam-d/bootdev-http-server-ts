import * as argon2 from "argon2";
import jwt, { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { InternalServerError} from "./error.js";


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
    type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

    const jwtPayload : Payload = {
        "iss": "chirpy",
        "sub": userID,
        "iat": Math.floor(Date.now() / 1000),
        "exp": Math.floor(Date.now() / 1000) + expiresIn
    }

    return sign(jwtPayload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
    return JSON.stringify(verify(tokenString, secret));
}