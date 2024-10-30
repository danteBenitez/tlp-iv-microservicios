import { Request, Response, Router } from "express";
import { ROLES } from "../constants/role.constant";
import { PurchasesController } from "../controllers/purchases.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { purchaseService } from "../services/purchase.service";

const router = Router();

const controller = new PurchasesController(purchaseService);

router.use([authMiddleware]);

router.get('/', [...roleMiddleware(ROLES.ADMIN)], (req: Request, res: Response) => controller.findAll(req, res));

router.get('/:purchaseId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.buy(req, res))

export default router;