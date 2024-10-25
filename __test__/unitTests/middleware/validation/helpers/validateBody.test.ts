import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {validateBody} from "../../../../../src/middleware/validation/helpers/validateBody.js";

describe('validateBody', () => {
    const schema = z.object({
        name: z.string().min(1, "String must contain at least 1 character"),
        age: z.number().min(0, "Number must be greater than or equal to 0"),
    }).strict()

    const validData = {
        name: "Elon",
        age: 20
    }

    const invalidData = {
        name: "",
        age: -2
    }

    it('should not throw an error for valid input', () => {
        expect(() => validateBody(schema, validData)).not.toThrow();
    });

    it('should throw error for invalid input', () => {
        expect(() => validateBody(schema, invalidData)).toThrow(
            'String must contain at least 1 character // Number must be greater than or equal to 0'
        );
    });

    it('should throw a BadRequestError for missing required fields', () => {
        const invalidBody = { age: 25 };
        expect(() => validateBody(schema, invalidBody)).toThrow('Required');
    });

    it('should throw a BadRequestError for unexpected fields', () => {
        const invalidBody = { name: 'Jane', age: 25, extraField: 'extraValue' };
        expect(() => validateBody(schema, invalidBody)).toThrow(new RegExp("unrecognized key", "i"));
    });
});