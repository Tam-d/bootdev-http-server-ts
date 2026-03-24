import { NextFunction, Request, Response } from "express";
import { createUser, deleteAllUsers, getUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema";
import { hashPassword } from "../auth.js"

export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) : Promise<void> {
    type RequestBody = {
        email: string,
        password: string
    }

    type CreatedUser = Omit<NewUser, "hashedPassword">;

    const reqBody : RequestBody = req.body

    try {
        const hashedPassword = await hashPassword(reqBody.password)

        const newUser: NewUser = {
            email: reqBody.email,
            hashedPassword: hashedPassword
        }

        const createdUser : CreatedUser  = await createUser(newUser);

        res.status(201);
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(
            createdUser
        ));
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