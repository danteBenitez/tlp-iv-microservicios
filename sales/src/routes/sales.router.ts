import { Request, Response, Router } from "express";
import { ROLES } from "../constants/role.constant";
import { SalesController } from "../controllers/sales.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

const controller = new SalesController();

router.use([authMiddleware]);

router.get('/', [...roleMiddleware(ROLES.ADMIN)], (req: Request, res: Response) => controller.findAll(req, res));

router.get('/:saleId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.sell(req, res))

export default router;