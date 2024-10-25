import { describe, it, expect } from 'vitest';
import {toSnakeCase} from "../../../../src/lib/orm/toSnakeCase.js";

describe('toSnakeCase', () => {
    it('should convert an object with camelCase keys to snake_case', () => {
        const input = { firstName: 'John', lastName: 'Doe', userId: 1 };
        const expectedOutput = { first_name: 'John', last_name: 'Doe', user_id: 1 };

        expect(toSnakeCase(input)).toEqual(expectedOutput);
    });

    it('should convert nested objects with camelCase keys to snake_case', () => {
        const input = { userInfo: { firstName: 'Jane', lastName: 'Doe' }, userId: 2 };
        const expectedOutput = { user_info: { first_name: 'Jane', last_name: 'Doe' }, user_id: 2 };

        expect(toSnakeCase(input)).toEqual(expectedOutput);
    });

    it('should handle arrays of objects', () => {
        const input = [
            { firstName: 'John', lastName: 'Doe' },
            { userId: 1, emailAddress: 'john.doe@example.com' }
        ];

        const expectedOutput = [
            { first_name: 'John', last_name: 'Doe' },
            { user_id: 1, email_address: 'john.doe@example.com' }
        ];

        expect(toSnakeCase(input)).toEqual(expectedOutput);
    });

    it('should return an empty object when input is an empty object', () => {
        expect(toSnakeCase({})).toEqual({});
    });
});