import { NextFunction, Request, Response } from "express";
import { createUser, deleteAllUsers, getUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema";
import { hashPassword } from "../auth.js"
import { respondWithJSON } from "../respond.js";
import { BadRequestError, InternalServerError } from "../error.js";

export type CreatedUser = Omit<NewUser, "hashedPassword">;

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        type Payload = {
            email: string,
            password: string
        }

        const payload : Payload = req.body

        if(!payload.email || !payload.password) {
            throw new BadRequestError("Must provide email and password");
        }

        const hashedPassword = await hashPassword(payload.password)

        const newUser = await createUser({
            email: payload.email,
            hashedPassword: hashedPassword
        } satisfies NewUser);

        if(!newUser) {
            throw new InternalServerError("Unable to create user");
        }

        respondWithJSON(res,201, {
            id: newUser.id,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        } satisfies CreatedUser);
    }
    catch(error) {
        next(error)
    }
}

export async function handlerGetUser(email: string) {
    return await getUser(email);
}

export async function handlerDeleteUsers() {
    await deleteAllUsers();
}