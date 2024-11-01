import { Router } from "express";
import { ShipmentController } from "../controllers/shipment.controller";

const router = Router();

const controller = new ShipmentController();

router.get('/', (req, res) => controller.findForUser(req, res));

export default router;