import { Request, Response } from "express";
import { createUser } from "./db/queries/users.js";
import { NewUser } from "./db/schema";

export async function handlerCreateUser(req: Request, res: Response) : Promise<void> {
    try {
        let newUser: NewUser = {
            email: req.body.email
        }

        console.log(`Attempting to create user with email ${newUser.email}`);

        let createdUser = await createUser(newUser);

        console.log(`The created user:\n ${JSON.stringify(createdUser)}`);

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