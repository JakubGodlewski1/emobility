import {z} from "zod";
import {BadRequestError} from "../../../errors/customErrors.js";

export const validateBody = (validator: z.ZodObject<any>, body: Record<string, any>) => {
    const result = validator.safeParse(body)
    if (!result.success) {
        const errors: string[] = result.error.issues.map(issue => issue.message);
        const combinedErrors = errors.join(' // ')
        throw new BadRequestError(combinedErrors)
    }
}