import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { uploadMiddleware } from "../middleware/file.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { productService } from "../services/product.service";

const controller = new ProductController(productService);

const router: Router = Router();

router.get('/', (req, res) => controller.findAll(req, res));

router.get('/images/:imageId', (req, res) => controller.getImageForProduct(req, res));

router.get('/:productId', (req, res) => controller.findById(req, res));

router.use(roleMiddleware("admin"));

router.post('/', uploadMiddleware.array("productImage", 20), (req, res) => controller.create(req, res));

router.patch('/:productId', uploadMiddleware.array("productImage", 20), (req, res) => controller.update(req, res));

router.delete('/:productId', (req, res) => controller.delete(req, res));

export default router;