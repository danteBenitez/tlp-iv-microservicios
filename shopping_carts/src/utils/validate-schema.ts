import { Request } from "express";
import { Schema, z, ZodError } from "zod";

export class ValidationError extends Error {
    constructor(private zod: ZodError) {
        super(zod.message);
    }

    issues() {
        return this.zod.issues;
    }
}

type ValidationResult<TSchema extends Schema> = {
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
            throw new ValidationError(error);
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
            throw new ValidationError(error);
        }

        return {
            data: data as z.infer<TSchema>,
            success,
            error
        }
    }
}

export const { validateRequest, validateRequestBody } = new ValidationAdapter();