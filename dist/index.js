import express from "express";
const app = express();
const PORT = 8080;
app.use("/app", express.static("./src/app"));
app.use(middlewareLogResponses);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
app.get("/healthz", handlerReadiness);
async function handlerReadiness(req, res) {
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
