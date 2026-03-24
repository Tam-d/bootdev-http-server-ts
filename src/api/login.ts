import { NextFunction, Request, Response } from "express";
import { checkPasswordHash } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { UnauthorizedError } from "../error.js";
import { handlerGetUser } from "./users.js";

export async function handlerUserLogin(
    req: Request, 
    res: Response,
    next: NextFunction
) : Promise<void> {

    type RequestBody = {
        email: string,
        password: string
    }

    type SanitizedUser = Omit<NewUser, "hashedPassword">;
    
    const reqBody : RequestBody = req.body

    try {
        if( reqBody.email === undefined || typeof reqBody.email !== "string") {
            throw new UnauthorizedError("Invalid or empty email");
        }
        if( reqBody.password === undefined || typeof reqBody.password !== "string") {
            throw new UnauthorizedError("Invalid or empty password");
        }

        const existingUser: NewUser = await handlerGetUser(reqBody.email);

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

            res.status(200);
            res.set("Content-Type", "application/json");
            res.send(JSON.stringify(
                user
            ));
        } 
    }
    catch(error) {
        console.log("Error from login");
        console.log((error as Error).message);
        console.log((error as Error).cause);
        next(error);
    }
}