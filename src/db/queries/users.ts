import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { NewUser, User, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function updateUser(user: User) {
  const [result] = await db
    .update(users)
    .set(user)
    .where(eq(users.id, user.id!))
    .returning();

  return result;
}

export async function upgradeUserToRed(userId: string) {
  const [result] = await db
    .update(users)
    .set({isChirpyRed: true})
    .where(eq(users.id, userId))
    .returning();

  return result;
}

export async function getUser(email: string) {
  const [result] = await db.select()
    .from(users)
    .where(eq(users.email, email));
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}