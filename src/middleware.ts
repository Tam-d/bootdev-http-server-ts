import type { Request, Response, NextFunction } from "express";
import { chirpyConfig } from "./config.js";
import { Error400, InternalServerError, UnauthorizedError } from "./error.js";
import { respondWithError } from "./respond.js";

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
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
    console.error(`Entered error middleware.`);
    console.log(`${error.message}`);
    let errorCode = 500;

    if(error instanceof Error400) {
        errorCode = 400;
    }
    else if( error instanceof UnauthorizedError) {
        errorCode = 401;
    }
    else if(error instanceof InternalServerError) {
        errorCode = 500;
    }
    else {
        errorCode = 500;
    }

    respondWithError(res, errorCode, error.message);
}
