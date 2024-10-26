import { ROLES } from "../../constants/roles.constant";
import Role from "../../models/role.model";

const ROLES_TO_INSERT = [
    {
        roleId: 1,
        name: ROLES.ADMIN,
    },
    {
        roleId: 2,
        name: ROLES.USER,
    }
];

export async function seedRoles() {
    return Promise.all(
        ROLES_TO_INSERT.map((role) => {
            return Role.findOrCreate({
                where: role,
                defaults: role,
            });
        })
    );
}