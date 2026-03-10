process.loadEnvFile();

import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  fileserverHits: number,
  dbURL: string
};

type DBConfig = {
  db: string,
  migrationConfig: MigrationConfig
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const chirpyConfig = {
  apiConfig: {  
    fileserverHits: 0,
    dbURL: envOrThrow("DB_URL")
  },
  dbConfig: {
    dbUrl: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig
  }
}

function envOrThrow(key: string) : string{
  if(process.env[key] === undefined) {
    throw Error(`${key} not found in enviroment variables`);
  }
  return process.env[key];
}