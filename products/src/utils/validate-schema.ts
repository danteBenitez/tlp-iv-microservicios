import { Request } from "express";
import { Schema, z, ZodError } from "zod";

class ValidationError extends Error {
    constructor(zod: ZodError) {
        super(zod.message);
    }
}

type ValidationResult<TSchema extends Schema> = {
    data: undefined,
    success: false,
    error: ValidationError
} | {
    data: z.infer<TSchema>,
    success: true,
    error: undefined
};

interface RequestValidator {
    validateRequest<TSchema extends Schema>(req: Request, schema: TSchema): Promise<ValidationResult<TSchema>>;
    validateRequestBody<TSchema extends Schema>(req: Request, schema: TSchema): Promise<ValidationResult<TSchema>>;
}

export class ValidationAdapter implements RequestValidator {
    async validateRequest<TSchema extends Schema>(req: Request, schema: TSchema): Promise<ValidationResult<TSchema>> {
        const { data, success, error } = await schema.safeParseAsync(req);
        if (!success) {
            return {
                data,
                success,
                error: error as ZodError
            };
        }

        return {
            data: data as z.infer<TSchema>,
            success,
            error
        }
    }

    async validateRequestBody<TSchema extends Schema>(req: Request, schema: TSchema): Promise<ValidationResult<TSchema>> {
        const { data, success, error } = await schema.safeParseAsync(req.body);

        if (!success) {
            return {
                data,
                success,
                error: error as ZodError
            };
        }

        return {
            data: data as z.infer<TSchema>,
            success,
            error
        }
    }
}

export const { validateRequest, validateRequestBody } = new ValidationAdapter();
