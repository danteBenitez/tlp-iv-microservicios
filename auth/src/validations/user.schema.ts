import { z } from "zod";
import { ADMIN_ALLOWED_ROLES } from "../constants/roles.constant.js";

const pluralFormatter = new Intl.ListFormat("es", {
    type: "disjunction"
});

export const createUserSchema = z.object({
    username: z.string().min(1, {
        message: "El nombre de usuario es requerido"
    }).max(255, {
        message: "El nombre de usuario debe tener máximo 255 caracteres"
    }),
    email: z.string().min(1, {
        message: "El correo electrónico es requerido"
    }).email({
        message: "Correo electrónico no es válido"
    }),
    password: z.string()
        .refine((password) => /[A-Z]/.test(password), {
            message: "La contraseña debe tener al menos una mayúscula",
        })
        .refine((password) => /[a-z]/.test(password), {
            message: "La contraseña debe tener al menos una minúscula",
        })
        .refine((password) => /[0-9]/.test(password), {
            message: "La contraseña debe tener al menos un número"
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "La contraseña debe tener al menos un caracter especial",
        })
});

export const userIdSchema = z.object({
    params: z.object({
        userId: z.number({ coerce: true, message: "ID de usuario inválida" })
    })
});

export const createUserByAdminSchema = z.object({
    body: createUserSchema.extend({
        roles: z.array(z.enum(ADMIN_ALLOWED_ROLES, {
            message: "El rol debe ser uno de " + pluralFormatter.format(ADMIN_ALLOWED_ROLES)
        })),
    })
});

export const updateUserByAdminSchema = z.intersection(z.object({
    body: createUserSchema.omit({ password: true }).extend({
        roles: z.array(z.enum(ADMIN_ALLOWED_ROLES, {
            message: "El rol debe ser uno de " + pluralFormatter.format(ADMIN_ALLOWED_ROLES)
        })),
    }).partial()
}), userIdSchema);

export type CreateUserData = z.infer<typeof createUserSchema>;
export type CreateUserByAdmin = z.infer<typeof createUserByAdminSchema>["body"];

export const updateUserSchema = z.object({
    body: createUserSchema.partial(),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>["body"];

export type UpdateUserByAdmin = z.infer<typeof updateUserByAdminSchema>["body"];

export const signInSchema = z.object({
    username: z.string(),
    password: z.string()
});

export type SignInData = z.infer<typeof signInSchema>;