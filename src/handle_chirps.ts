import { Request, Response } from "express";

export async function validateChirp(req: Request, res: Response) : Promise<void> {
    let body = req.body;

    try {
        if(!(body.body.length <= 140)) {
            throw Error("Chirp is too long");
        }
        res.set("Content-Type", "application/json");
        res.send(JSON.stringify({"valid": true}));
            
        } catch (error) {
            res.set("Content-Type", "application/json");
            res.status(400).send(
                JSON.stringify({"error": (error as Error).message})
            );
        }
}