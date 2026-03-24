import type { Request, Response, NextFunction } from "express";
import { chirpyConfig } from "./config.js";
import { Error400, InternalServerError, UnauthorizedError } from "./error.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) : void {
    res.on("finish", () => {
        if(res.statusCode === 200) {
            console.log(`[OK] ${req.method} ${req.url} - Status: ${res.statusCode}}`);
        }
        else {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}}`);
        }
    });

    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  chirpyConfig.apiConfig.fileserverHits++;

  next();
}

export function middlewareErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.error(`Entered error middleware.`);
    console.log(`${err.message}`);

    if(err instanceof Error400) {
        res.status(400).json({
            error: err.message,
        });
    }
    else if( err instanceof UnauthorizedError) {
        res.status(401).json({
            error: err.message,
        });
    }
    else if(err instanceof InternalServerError) {
        res.status(500).json({
            error: err.message,
        });
    }
    else {
        res.status(500).json({
            error: "Something went wrong on our end",
        });
    }


}
