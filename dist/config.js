process.loadEnvFile();
export let chirpyStateData = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL")
};
function envOrThrow(key) {
    if (process.env[key] === undefined) {
        throw Error(`${key} not found in enviroment variables`);
    }
    return process.env[key];
}
