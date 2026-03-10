import type { Request, Response, NextFunction } from "express";
import { chirpyStateData } from "./config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) : void {
    res.on("finish", () => {
        if(res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}}`);
        } 
    });

    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  chirpyStateData.fileserverHits++;

  next();
}