import { ROLES } from "../../constants/roles.constant.js";
import Role from "../../models/role.model.js";
import UserRole from "../../models/user-roles.model.js";
import User from "../../models/user.model.js";
import { encryptionService } from "../../services/encryption.service.js";

export async function seedAdmin() {
    const adminRole = await Role.findOne({
        where: {
            name: ROLES.ADMIN
        },
    });
    const userRole = await Role.findOne({
        where: {
            name: ROLES.USER
        }
    })

    if (!adminRole) {
        throw new Error(
            "Rol de administrador faltante. Sincronice la base de datos"
        );
    }

    if (!userRole) {
        throw new Error(
            "Rol de usuario faltante. Sincronice la base de datos"
        );
    }

    const adminUser = await UserRole.findOne({
        where: {
            roleId: adminRole.roleId,
        },
    });

    if (!adminUser) {
        // Si no hay usuario con el rol de administrador,
        // creamos uno génerico.
        const user = await User.create({
            username: "admin",
            email: "admin@example.com",
            password: await encryptionService.encrypt("admin"),
            roles: []
        });
        // Y le añadimos el rol correspondiente.
        await user.$set("roles", [adminRole, userRole]);
    }

    return adminUser;
}