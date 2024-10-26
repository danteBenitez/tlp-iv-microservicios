export const ROLES = {
    ADMIN: "admin",
    USER: "employee"
} as const;

export type RoleName = typeof ROLES[keyof typeof ROLES];

export const ADMIN_ALLOWED_ROLES = [ROLES.USER, ROLES.ADMIN] as const;

export type AdminAssignableRoles = typeof ADMIN_ALLOWED_ROLES[keyof typeof ADMIN_ALLOWED_ROLES];