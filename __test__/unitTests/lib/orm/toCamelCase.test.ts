import { describe, it, expect } from 'vitest';
import {toCamelCase} from "../../../../src/lib/orm/ToCamelCase.js";

describe('toCamelCase', () => {
    it('should convert an array of objects with snake_case keys to camelCase', () => {
        const input = [
            { first_name: 'John', last_name: 'Doe' },
            { user_id: 1, email_address: 'john.doe@example.com' }
        ];

        const expectedOutput = [
            { firstName: 'John', lastName: 'Doe' },
            { userId: 1, emailAddress: 'john.doe@example.com' }
        ];

        expect(toCamelCase(input)).toEqual(expectedOutput);
    });

    it('should return an empty array when input is empty', () => {
        expect(toCamelCase([])).toEqual([]);
    });

    it('should handle objects with no snake_case keys', () => {
        const input = [
            { firstName: 'John', lastName: 'Doe' },
            { userId: 1, emailAddress: 'john.doe@example.com' }
        ];

        const expectedOutput = [
            { firstName: 'John', lastName: 'Doe' },
            { userId: 1, emailAddress: 'john.doe@example.com' }
        ];

        expect(toCamelCase(input)).toEqual(expectedOutput);
    });
});