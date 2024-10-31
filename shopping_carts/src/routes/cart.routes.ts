import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

const controller = new CartController();

router.use([authMiddleware]);

router.get('/', (req, res) => controller.findForUser(req, res));

router.post('/', (req, res) => controller.addToCartOf(req, res));

router.post('/buy', (req, res) => controller.buyAllCart(req, res));

export default router;