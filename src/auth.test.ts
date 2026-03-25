import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return a valid JSON web token payload", () => {
    
    const jwt = makeJWT("userid1", 1000, hash1);
    const validatedToken = JSON.parse(validateJWT(jwt, hash1));

    expect(validatedToken["iss"]).toBe("chirpy");
    expect(validatedToken["sub"]).toBe("userid1");
    expect(validatedToken["iat"]).toBeDefined();
    expect(validatedToken["exp"]).toBeDefined();
  });

});