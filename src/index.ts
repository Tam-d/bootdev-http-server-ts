import express from "express";
import { Request, Response } from "express";

import { middlewareLogResponses } from "./middleware.js";
import { middlewareMetricsInc } from "./middleware.js";
import { middlewareErrorHandler } from "./middleware.js";

import { chirpyConfig } from "./config.js";

import { validateChirp } from "./handle_chirps.js";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { handlerCreateUser } from "./api/users.js";
import { deleteAllUsers } from "./db/queries/users.js";
import { handlerCreateChirp, handlerDeleteChirps } from "./api/chirps.js";

const migrationClient = postgres(chirpyConfig.dbConfig.dbUrl, { max: 1 });
await migrate(drizzle(migrationClient), chirpyConfig.dbConfig.migrationConfig);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", validateChirp);
app.post("/api/chirps", handlerCreateChirp);
app.post("/api/users", handlerCreateUser);

app.get("/admin/metrics", handlerRequestCount);
app.post("/admin/reset", handlerResetRequestCount);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

async function handlerReadiness(req: Request, res: Response) : Promise<void> {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

async function handlerRequestCount(req: Request, res: Response) : Promise<void> {
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

async function handlerResetRequestCount(req: Request, res: Response) : Promise<void> {
    if(chirpyConfig.apiConfig.platform !== "dev") {
        res.status(403);
        res.set("Content-Type", "text/plain; charset=utf-8");
        res.send("Forbidden");
        return;
    }

    chirpyConfig.apiConfig.fileserverHits = 0;
    handlerDeleteChirps();
    deleteAllUsers();
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

