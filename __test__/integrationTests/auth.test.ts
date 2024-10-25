import request from "supertest"
import {describe, expect} from "vitest";
import app from "../../src/app.js";
import {log} from "winston";

const url = "/api/v1/auth"

const signIn = async () => {
    const {body:{data:{accessToken}}, headers} =await request(app).post(`${url}/sign-in`).send({
        username: "username-test",
        password: "password-test",
    })
    const [cookieString] = headers['set-cookie'];
    const jwtMatch = cookieString.match(/jwt=([^;]+)/);
    const refreshToken = jwtMatch ? jwtMatch[1] : "";

    return {accessToken, refreshToken}
}

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

    it('should forbid user from making any requests (Except auth router) if they are not logged in', async () => {
        const response =await request(app).get("/api/v1/connectors")

        expect(response.statusCode === 403)
        expect(response.body.error).toMatch(/access denied/i)
    });

    it('should return 200 and array of connectors when sending correct jwt token on headers', async () => {
        //sign in
        const {body:{data:{accessToken}}} =await request(app).post(`${url}/sign-in`).send({
            username: "username-test",
            password: "password-test",
        })

        //add token to headers and get connectors
        const {body} = await request(app).get("/api/v1/connectors").set('authorization', `Bearer ${accessToken}`)
        expect(Array.isArray(body.data)).toBe(true)
    });

    it('should send new access token when sending request to /refresh if refresh token is valid',async () => {
        //sign in
        const {accessToken, refreshToken} = await signIn()

        //set token in headers as bearer token
        const {body} = await request(app).get("/api/v1/connectors").set('authorization', `Bearer ${accessToken}`)

        //try to get same data
        expect(Array.isArray(body.data)).toBe(true)

        //request new access token
        const {body:{data:{accessToken:accessToken2}}} = await request(app).get(`${url}/refresh`).set("Cookie", `jwt=${refreshToken}`)

        //validate that the new token !== to old one
        expect(accessToken2 !== undefined && accessToken2 !== accessToken)

        //set new one in headers as bearer token
        const {body:{data:connectors}} = await request(app).get("/api/v1/connectors").set('authorization', `Bearer ${accessToken2}`)

        //expect success
        expect(Array.isArray(connectors)).toBe(true)
    });

    it('when user signs out, refresh token should be deleted from cache and access token should be added to cache', async () => {
        //sign in
        const {accessToken, refreshToken} = await signIn()

        //logout
         await request(app).get(`${url}/logout`)
            .set("Cookie", `jwt=${refreshToken}`)
            .set('authorization', `Bearer ${accessToken}`)

        //try to get new access token by calling /refresh
        const {body} = await request(app).get(`${url}/refresh`).set("Cookie", `jwt=${refreshToken}`)

        //dont get any token
        expect(body.data).toBe(undefined)

        //try to get some data
        const {body:connectorsBody} = await request(app).get(`/api/v1/connectors`)
            .set("Cookie", `jwt=${refreshToken}`)
            .set('authorization', `Bearer ${accessToken}`)

        expect(connectorsBody.data).toBe(undefined)
    });
})