import {afterEach, describe} from "vitest";
import {CreateConnector} from "../../types.js";
import Test from "../helpers.js";
import connectorRepo from "../../src/repos/connector.repo.js";

describe("connectors",async () => {
    const {request} = await Test.build("connectors")

    afterEach(async () => {
        await connectorRepo.deleteAll()
    })

    const connector:CreateConnector = {
        name: "connector1",
        priority: false
    }

    const connector2:CreateConnector = {
        name: "connector2",
        priority: true
    }

    it('should add connector to db', async () => {
        const response = await request.post(connector)
        expect(response.body.data).toMatchObject(connector)
    });

    it('should not add connector to db if any required element is missing', async () => {
        const response = await request.post({...connector, name: undefined})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/name must be provided/i)
    });

    it('should not add connector to db if there is any additional key:value in the body', async () => {
        const response = await request.post({...connector, additionalField:"extra"})
        expect(response.body.data).toBe(undefined)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toMatch(/does not exist on/i)
    });

    it('Should update connector one field', async () => {
        const {body:{data}} = await request.post(connector)
        const response = await request.put(data.id, {name: "updated name"})
        expect(response.body.data).toMatchObject({...data, name: "updated name"})
    });


    it('Should get all connectors',async () => {
        await request.post(connector)
        await request.post(connector2)

        const response = await request.get()
        expect(response.body.data.length).toBe(2)

    });

    it('should get given connector by filtering',async () => {
        await request.post(connector)
        await request.post(connector2)

        const response = await request.get("?name=connector1")
        expect(response.body.data.length).toBe(1)
    });

    it('should delete connector if the charging station id is not specified',async () => {
        await request.post(connector)
        const {body:{data:{id}}} = await request.post(connector2)

        const response1 = await request.get()
        expect(response1.body.data.length).toBe(2)

        await request.delete(id)

        const response2 = await request.get()
        expect(response2.body.data.length).toBe(1)
    });

    it('should throw error during get, update, delete if id of an element is not correct uuid', async () => {
        const {body:{error:error1}} = await request.getById("123412341231")
        const {body:{error:error2}} = await request.put("123123212131",connector)
        const {body:{error: error3}} = await request.delete("123412341231")

        expect(error1).toMatch(/ is not a valid uuid/i)
        expect(error2).toMatch(/ is not a valid uuid/i)
        expect(error3).toMatch(/ is not a valid uuid/i)
    });
})