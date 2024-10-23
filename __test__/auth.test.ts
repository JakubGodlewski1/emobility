import request from "supertest"
import {describe, expect} from "vitest";
import app from "../src/app.js";

const url = "/api/v1/auth"

describe("auth", ()=>{
    it('should return error when credentials are incorrect', async () => {
       const response =await request(app).post(`${url}/sign-in`).send({
            username: "wrong username",
            password: "wrong password",
        })

        expect(response.statusCode === 403)
        expect(response.body.error).toMatch(/credentials are not correct/i)
    });

    it('should return jwt token when credentials are correct',async () => {
        const response =await request(app).post(`${url}/sign-in`).send({
            username: "username-test",
            password: "password-test",
        })

        expect(response.statusCode === 200)
        expect(response.body.data.accessToken).not.toBe(undefined)
    });

    it('should add refresh token to cookies header', async () => {
        const response =await request(app).post(`${url}/sign-in`).send({
            username: "username-test",
            password: "password-test",
        })

        expect(response.statusCode === 200)
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();
    });
})