import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT, hashPassword, checkPasswordHash } from "./auth.js";
import { UnauthorizedError } from "./error.js";

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

});

describe("Jwt functions", () => {
    const secret = "secret";
    const wrongSecret = "wrong_secret";
    const userID = "some-unique-user-id";
    let validToken: string;

    beforeAll(async () => {
        validToken = makeJWT(userID, 1000, secret);
    });

    it("should verify the generated token is valid", () => {
        const result = validateJWT(validToken, secret);
        expect(result).toBe(userID);
    });

    it("should throw an error for an invalid token string", () => {
        expect(() => validateJWT("invalid.token.string", secret)).toThrow(
            UnauthorizedError,
        );
    });

    it("should throw an error when the token is signed with a wrong secret", () => {
        expect(() => validateJWT(validToken, wrongSecret)).toThrow(
            UnauthorizedError,
        );
  });
});