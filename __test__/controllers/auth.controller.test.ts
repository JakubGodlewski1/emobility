import {describe, expect} from "vitest";
import Jwt from "../../src/lib/jwt.js";
import AuthController from "../../src/controllers/auth.controller.js";
vi.mock("../../src/lib/jwt.js")

describe("AuthController", () => {
    const req = {
        body:{
            username:"wrong username"
        }
    } as any

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        cookie: vi.fn(),
    } as any


    it('should throw error if credentials are not correct', () => {

        expect(()=>AuthController.signIn(req, res)).toThrowError(/are not correct/i)
    });

    it('should send proper response when credentials are valid', () => {
        req.body.username = "username-test"
        req.body.password = "password-test"

        vi.mocked(Jwt.createAccessToken).mockReturnValue("123")


        AuthController.signIn(req, res)

        expect(res.json).toHaveBeenCalledWith({success:true, data: {accessToken: "123"}})
    });
})