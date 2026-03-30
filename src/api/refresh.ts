import { Request, Response, NextFunction } from "express";
import { getRefreshToken, updateRefreshToken } from "../db/queries/tokens.js";
import { getBearerToken, makeJWT } from "../auth.js";
import { UnauthorizedError } from "../error.js";
import { chirpyConfig } from "../config.js";
import { respondWithJSON } from "../respond.js";
import { date, datetime } from "drizzle-orm/mysql-core";

export async function handlerRefresh(
    req: Request, 
    res: Response,
    next: NextFunction
) : Promise<void> {
    try {
        const refreshToken = await getRefreshToken(getBearerToken(req));

        if(
            !refreshToken || 
            Date.now() >= refreshToken.expiresAt.getTime() ||
            refreshToken.revokedAt != null
        ) {
            throw new UnauthorizedError("Invalid refresh token");
        }

        const accessToken = makeJWT(
            refreshToken.userId, 
            3600,
            chirpyConfig.apiConfig.jwtSecret
        )

        respondWithJSON(
            res,
            200,
            {token: accessToken}
        );
    }
    catch(error) {
        next(error);
    }
}

export async function handlerRevoke(
    req: Request, 
    res: Response,
    next: NextFunction
) : Promise<void> {
    try {
        const refreshToken = await getRefreshToken(getBearerToken(req));

        if(!refreshToken) {
            throw new UnauthorizedError("Unable to retrieve token");
        }

        refreshToken.revokedAt = new Date(Date.now());

        const updatedRefreshToken = await updateRefreshToken(refreshToken);

        res.status(204).send();
        

    }
    catch(error) {
        next(error);
    }
}