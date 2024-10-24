import Controller from "./base.controller.js";
import {Connector, TableName} from "../../types.js";

class ConnectorController extends Controller<Connector> {
    constructor() {
        const tableName: TableName = 'connector';
        super(tableName);
    }
}

export default new ConnectorController()