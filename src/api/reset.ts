import { Request, Response } from "express";
import { chirpyConfig } from "../config.js";
import { handlerDeleteUsers } from "./users.js";

export async function handlerResetRequestCount(req: Request, res: Response) : Promise<void> {
    if(chirpyConfig.apiConfig.platform !== "dev") {
        res.status(403);
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.send("Forbidden");
        return;
    }

    chirpyConfig.apiConfig.fileserverHits = 0;
    handlerDeleteUsers();
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}