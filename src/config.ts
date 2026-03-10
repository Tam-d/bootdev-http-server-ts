process.loadEnvFile();

type APIConfig = {
  fileserverHits: number,
  dbURL: string
};


export let chirpyStateData : APIConfig = {
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL")
}

function envOrThrow(key: string) : string{
  if(process.env[key] === undefined) {
    throw Error(`${key} not found in enviroment variables`);
  }

  return process.env[key];
}