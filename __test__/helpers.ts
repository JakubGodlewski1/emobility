import request from 'supertest';
import app from "../src/app.js";

type Endpoint = "connectors" | "charging-stations" | "charging-station-types";

export default class Test {
   private endpoint: Endpoint
   private readonly token: string;

    constructor(endpoint: Endpoint, token: string) {
        this.token = token
        this.endpoint = endpoint;
    }

    static build = async (endpoint: Endpoint) => {
        const token = await this.signIn()
        return new Test(endpoint, token)
    }

   private static signIn = async () => {
        //get access token
        const response = await request(app)
            .post("/api/v1/auth/sign-in")
            .send({
                username: "username-test",
                password: "password-test",
            });

        return response.body.data.accessToken;
    }

    request = {
        getById: (id: string) => {
            return request(app)
                .get(`/api/v1/${this.endpoint}${id ? `/${id}` : ''}`)
                .set('Authorization', `Bearer ${this.token}`)
        },

        get: (query?: string) => {
            return request(app)
                .get(`/api/v1/${this.endpoint}${query ? `/${query}` : ''}`)
                .set('Authorization', `Bearer ${this.token}`);
        },

        post: (data: Record<string, any>) => {
            return request(app)
                .post(`/api/v1/${this.endpoint}`)
                .set('Authorization', `Bearer ${this.token}`)
                .send(data);
        },

        put: (id: string, data: Record<string, any>) => {
            return request(app)
                .put(`/api/v1/${this.endpoint}${id ? `/${id}` : ''}`)
                .set('Authorization', `Bearer ${this.token}`)
                .send(data);
        },

        delete: (id: string) => {
            return request(app)
                .delete(`/api/v1/${this.endpoint}${id ? `/${id}` : ''}`)
                .set('Authorization', `Bearer ${this.token}`);
        }
    };
}