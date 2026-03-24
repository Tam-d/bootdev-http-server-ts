import * as argon2 from "argon2";
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