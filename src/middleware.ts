import type { Request, Response, NextFunction } from "express";
import { chirpyConfig } from "./config.js";
import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from "./error.js";
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
    console.log(error.cause);
    let errorCode = 500;

    if(error instanceof BadRequestError) {
        errorCode = 400;
    }
    else if( error instanceof UnauthorizedError) {
        errorCode = 401;
    }
    else if( error instanceof ForbiddenError) {
        errorCode = 403;
    }
    else if( error instanceof NotFoundError) {
        errorCode = 404;
    }

    respondWithError(res, errorCode, error.message);
}
