import express from "express";
import { Request, Response } from "express";
import { NextFunction } from "express";
import { chirpyStateData } from "./config.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerValidateChirp)

app.get("/admin/metrics", handlerRequestCount);
app.post("/admin/reset", handlerResetRequestCount);

async function handlerReadiness(req: Request, res: Response) : Promise<void> {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

async function handlerValidateChirp(req: Request, res: Response) : Promise<void> {
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

async function handlerRequestCount(req: Request, res: Response) : Promise<void> {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(
        `<html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${chirpyStateData.fileserverHits} times!</p>
        </body>
        </html>`
    );
}

async function handlerResetRequestCount(req: Request, res: Response) : Promise<void> {
    chirpyStateData.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

function middlewareLogResponses(req: Request, res: Response, next: NextFunction) : void {
    res.on("finish", () => {
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