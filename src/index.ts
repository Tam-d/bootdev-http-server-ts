import express from "express";
import { Request, Response } from "express";
import { NextFunction } from "express";
import { chirpyStateData } from "./config.js";

const app = express();
const PORT = 8080;


app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerRequestCount);
app.get("/reset", handlerResetRequestCount)

async function handlerReadiness(req: Request, res: Response) : Promise<void> {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

async function handlerRequestCount(req: Request, res: Response) : Promise<void> {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(`Hits: ${chirpyStateData.fileserverHits}`);
}

async function handlerResetRequestCount(req: Request, res: Response) : Promise<void> {
    chirpyStateData.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

function middlewareLogResponses(req: Request, res: Response, next: NextFunction) : void {
    res.on("finish", () => {

        console.log(res.statusCode);

        if(res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}}`);
        } 
    });

    next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  chirpyStateData.fileserverHits++;

  next();
}