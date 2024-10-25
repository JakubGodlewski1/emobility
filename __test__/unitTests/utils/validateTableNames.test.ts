import { describe, it, expect } from 'vitest';
import {TABLE_NAMES} from "../../../src/config/constants.js";
import {validateTableNames} from "../../../src/utils/ValidateTableNames.js";
import {TableName} from "../../../types.js";


describe('validateTableNames', () => {
    it('should not throw an error for valid table names', () => {
        TABLE_NAMES.forEach((tableName) => {
            expect(() => validateTableNames(tableName as TableName)).not.toThrow();
        });
    });

    it('should throw an error for invalid table names', () => {
        const invalidTableName = 'INVALID_TABLE_NAME' as TableName;
        expect(() => validateTableNames(invalidTableName)).toThrowError("The provided table name does not exist");
    });
});