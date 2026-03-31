import { Request, Response, NextFunction } from "express";
import { upgradeUserToRed } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../error.js";
import { respondWithJSON } from "../respond.js";
import { getAPIKey } from "../auth.js";
import { chirpyConfig } from "../config.js";

export async function handlerUpgradeToRed(
    req: Request, 
    res: Response,
    next: NextFunction
) : Promise<void> {
    
    type Payload = {
        event: string,
        data: {
            userId:string
        }
    }
    
    try {

        const apiKey = getAPIKey(req);

        if(apiKey != chirpyConfig.apiConfig.polkaKey) {
            throw new UnauthorizedError("Authentication to api failed.");
        }

        const payload = req.body;
        
        if(payload.event !== "user.upgraded") {
            res.status(204).send();
            return;
        }

        const user = await upgradeUserToRed(payload.data.userId);

        if(user === undefined) {
            throw new NotFoundError("User not found");
        }

        respondWithJSON(res, 204, {});
    }
    catch(error){
        next(error);
    }
}