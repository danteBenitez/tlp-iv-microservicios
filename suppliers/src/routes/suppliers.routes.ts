import { Request, Response, Router } from "express";
import { SupplierController } from "../controllers/suppliers.controller";
import { roleMiddleware } from "../middleware/role.middleware";
import { suppliersService } from "../services/supplier.service";
import { authMiddleware } from "../middleware/auth.middleware";

const controller = new SupplierController(suppliersService);

const router: Router = Router();

router.get('/',[authMiddleware], (req: Request, res: Response) => controller.findAllSuppliers(req, res));

router.get('/:supplierId',[authMiddleware], (req: Request, res: Response) => controller.findById(req, res));

router.use(roleMiddleware("admin"));

router.post('/', (req: Request, res: Response) => controller.create(req, res));

router.patch('/:supplierId', (req: Request, res: Response) => controller.update(req, res));

router.delete('/:supplierId', (req: Request, res: Response) => controller.delete(req, res));

export default router;