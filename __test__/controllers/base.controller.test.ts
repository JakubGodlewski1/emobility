import {afterEach, describe, expect} from "vitest";
import Controller from "../../src/controllers/base.controller.js";
import connectorRepo from "../../src/repos/connector.repo.js";

vi.mock("../../src/repos/connector.repo.js")

const connector1 = {
    id: "1",
    priority: true,
    name :"connector"
}
const connector2 = {
    id: "2",
    priority: false,
    name :"connector2"
}

const replyWithObj = {
    success:true,
    data: connector1
}

const replyWithArray = {
    success:true,
    data: [connector1, connector2]
}


/*no tests for passing bad data, because it's handled in validation middleware (and middleware tests)*/
describe("BaseController", () => {
    const {get, update, create, deleteById, getById} = new Controller("connector")

    const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        cookie: vi.fn(),
    } as any

    afterEach(()=>{
        vi.clearAllMocks()
    })

    it('GET BY ID - should send back proper element', async () => {
        const req = {params: {id: "1"}} as any
        vi.mocked(connectorRepo.getById).mockResolvedValue(connector1)

        await getById(req, res)
        expect(res.json).toHaveBeenCalledWith(replyWithObj)
    });

      it('GET - should send back array', async () => {
          const req = {query: {priority:true}} as any
          vi.mocked(connectorRepo.get).mockResolvedValue([connector1, connector2])

          await get(req, res)
          expect(res.json).toHaveBeenCalledWith(replyWithArray)
    });

      it('DELETE BY ID - should send back deleted object', async () => {
          const req = {params: {id: "1"}} as any
          vi.mocked(connectorRepo.deleteById).mockResolvedValue(connector1)

          await deleteById(req, res)
          expect(res.json).toHaveBeenCalledWith(replyWithObj)
    });

      it('CREATE - should send back created object',async () => {
          const req = {params: {id: "1"}} as any
          vi.mocked(connectorRepo.insert).mockResolvedValue(connector1)

          await create(req, res)
          expect(res.json).toHaveBeenCalledWith(replyWithObj)
    });

      it('UPDATE - should send back updated object', async () => {
          const req = {params: {id: "1"}} as any
          vi.mocked(connectorRepo.update).mockResolvedValue(connector1)

          await update(req, res)
          expect(res.json).toHaveBeenCalledWith(replyWithObj)
    });
})