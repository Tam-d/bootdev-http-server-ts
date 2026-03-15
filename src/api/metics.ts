import { Request, Response } from "express";
import { chirpyConfig } from "../config.js";

export async function handlerRequestCount(req: Request, res: Response) : Promise<void> {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(
        `<html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${chirpyConfig.apiConfig.fileserverHits} times!</p>
        </body>
        </html>`
    );
}