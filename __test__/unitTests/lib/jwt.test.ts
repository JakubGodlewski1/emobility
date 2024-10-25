import {describe, expect} from "vitest";
import Jwt from "../../../src/lib/jwt.js";


describe("JWT", () => {
    it('should return jwt access token', () => {
        const token = Jwt.createAccessToken("123")
        expect(typeof token).toBe("string")
    });

    it('should create refresh token', () => {
        const token = Jwt.createRefreshToken("123")
        expect(typeof token).toBe("string")
    });

    it('should properly validate jwt access token', () => {
        const token = Jwt.createAccessToken("123")
        const success  = Jwt.verifyToken("bearer "+token, "access")
        expect(success).toBe(true)
    });

     it('should properly validate jwt refresh token', () => {
        const token = Jwt.createRefreshToken("123")
        const success  = Jwt.verifyToken(token, "refresh")
        expect(success).toBe(true)
    });


})