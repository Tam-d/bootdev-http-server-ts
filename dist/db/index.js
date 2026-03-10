import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { chirpyStateData } from "../config.js";
const conn = postgres(chirpyStateData.dbURL);
export const db = drizzle(conn, { schema });
