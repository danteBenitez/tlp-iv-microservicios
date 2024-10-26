import { Request, Response, Router } from "express";
import { ROLES } from "../constants/roles.constant.js";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { usersService } from "../services/user.service";

const router: Router = Router();
const controller = new UserController(usersService);


// Permitimos que cualquier usuario pueda actualizar su propio perfil
router.patch('/me', [authMiddleware], (req: Request, res: Response) => controller.updateProfile(req, res));

router.use([...roleMiddleware(ROLES.ADMIN)]);

router.get('/', (req, res) => controller.findAllUsers(req, res));

router.get('/:userId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.create(req, res));

router.delete('/:userId', (req, res) => controller.deleteUserById(req, res));


router.patch('/:userId', (req, res) => controller.updateUserById(req, res));

export default router;