import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { RefreshToken, refreshTokens } from "../schema.js";

export async function insertRefreshToken(refreshToken: RefreshToken) {
    const [rows] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .returning();
    return rows;
}

export async function updateRefreshToken(refreshToken: RefreshToken) {
    const [result] = await db
        .update(refreshTokens)
        .set(refreshToken)
        .where(eq(refreshTokens.token, refreshToken.token))
        .returning();
    return result;
}

export async function getRefreshToken(token: string) {
    const [result] = await db.select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    return result;
}