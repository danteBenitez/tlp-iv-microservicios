import { Router } from "express";
import { SupplierController } from "../controllers/suppliers.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { suppliersService } from "../services/supplier.service";

const controller = new SupplierController(suppliersService);

const router: Router = Router();

router.get('/', (req, res) => controller.findAllSuppliers(req, res));

router.get('/:supplierId', (req, res) => controller.findById(req, res));

router.use(roleMiddleware("admin"));

router.post('/', (req, res) => controller.create(req, res));

router.patch('/:supplierId', (req, res) => controller.update(req, res));

router.delete('/:supplierId', (req, res) => controller.delete(req, res));

export default router;