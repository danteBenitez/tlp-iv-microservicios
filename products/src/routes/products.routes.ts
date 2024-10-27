import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { productService } from "../services/product.service";

const controller = new ProductController(productService);

const router: Router = Router();

router.get('/', (req, res) => controller.findAll(req, res));

router.get('/:productId', (req, res) => controller.findById(req, res));

router.post('/', (req, res) => controller.create(req, res));

router.patch('/:productId', (req, res) => controller.update(req, res));

router.delete('/:productId', (req, res) => controller.delete(req, res));

export default router;