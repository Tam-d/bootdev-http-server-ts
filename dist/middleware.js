import { chirpyStateData } from "./config.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (res.statusCode !== 200) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}}`);
        }
    });
    next();
}
export function middlewareMetricsInc(req, res, next) {
    chirpyStateData.fileserverHits++;
    next();
}
export function middlewareErrorHandler(err, req, res, next) {
    console.error(err.message);
    res.status(500).json({
        error: "Something went wrong on our end",
    });
}
