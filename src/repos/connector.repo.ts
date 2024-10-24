import Repo from "./base.repo.js";
import {Connector, TableName} from "../../types.js";

class ConnectorRepo extends Repo<Connector> {
    constructor() {
        const tableName: TableName = "connector"
        super(tableName);
    }
}

export default new ConnectorRepo();