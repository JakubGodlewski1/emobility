import request from "supertest"
import {describe, expect} from "vitest";
import app from "../src/app.js";

const url = "/api/v1/auth"

describe("auth", ()=>{
    it('should return error when credentials are incorrect', async () => {
       const response =await  request(app).post(`${url}/sign-in`).send({
            username: "wrong username",
            password: "wrong password",
        })

        expect(response.statusCode === 403)
        expect(response.body.error).toMatch(/credentials are not correct/i)
    });

})