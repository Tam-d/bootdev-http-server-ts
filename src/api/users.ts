import { Request, Response } from "express";
import { createUser, deleteAllUsers } from "../db/queries/users.js";
import { NewUser } from "../db/schema";

export async function handlerCreateUser(req: Request, res: Response) : Promise<void> {
    try {
        let newUser: NewUser = {
            email: req.body.email
        }

        let createdUser = await createUser(newUser);

        res.status(201);
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify(
            createdUser
        ));  
    }
    catch(e) {
        console.log((e as Error).message);
    }
}

export async function handlerDeleteUsers() {
    await deleteAllUsers();
}