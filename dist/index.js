import express from "express";
import { chirpyStateData } from "./config.js";
const app = express();
const PORT = 8080;
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerRequestCount);
app.post("/admin/reset", handlerResetRequestCount);
async function handlerReadiness(req, res) {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}
async function handlerRequestCount(req, res) {
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<html>
        <body>
            <h1>Welcome, Chirpy Admin</h1>
            <p>Chirpy has been visited ${chirpyStateData.fileserverHits} times!</p>
        </body>
        </html>`);
}
async function handlerResetRequestCount(req, res) {
    chirpyStateData.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}
function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        console.log(res.statusCode);
        if (res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}}`);
        }
    });
    next();
}
function middlewareMetricsInc(req, res, next) {
    chirpyStateData.fileserverHits++;
    next();
}
