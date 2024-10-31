import { Request, Response } from "express";
import { FindProductOptions } from "../repositories/product.repository";
import { FileNotFoundError, fileService as fileService_, FilesService } from "../services/file.service";
import { ExistingProductError, ImageNotFoundError, ProductNotFoundError, ProductService } from "../services/product.service";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import { createProductSchema, findProductSchema, imageIdSchema, productIdSchema, updateProductSchema } from "../validations/product.schema";

export class ProductController {

    constructor(
        private productService: ProductService,
        private fileService: FilesService = fileService_
    ) { }

    async findAll(req: Request, res: Response) {
        const { data } = await validateRequest(req, findProductSchema);
        const options: Partial<FindProductOptions> = {}

        if (data?.query?.orderDirection && data.query.orderField) {
            options["order"] = {
                field: data.query.orderField,
                direction: data.query.orderDirection
            }
        }

        if (data?.query?.page) {
            options["page"] = data.query.page;
            options["perPage"] = data.query.perPage;
        }

        // Convertir "tag" a ["tag"] para normalizar lo recibido por el servicio
        let tags = typeof data.query?.tags == "string" ? [data.query.tags] : data?.query?.tags;
        const found = await this.productService.findAll({
            ...options,
            filter: { ...data.query, tags }
        });

        res.status(200).json(found);
    }

    async findById(req: Request, res: Response) {
        const { data } = await validateRequest(req, productIdSchema);
        try {
            const found = await this.productService.findById(data.params.productId);
            return res.status(200).json(found);

        } catch (err) {
            if (err instanceof ProductNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }
            throw err;
        }
    }

    async getImageForProduct(req: Request, res: Response) {
        const { data } = await validateRequest(req, imageIdSchema);
        try {
            const found = await this.productService.getImageForProduct(data.params.imageId);
            res.header("Content-Type", found?.type);
            return res.status(200).send(await this.fileService.readFile(found?.path));
        } catch (err) {
            if (err instanceof ImageNotFoundError || err instanceof FileNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }
            throw err;
        }
    }

    async create(req: Request, res: Response) {
        const { data } = await validateRequestBody(req, createProductSchema);
        try {
            console.log("Creating products...", req.files);
            const created = await this.productService.create(data, req.files as Express.Multer.File[]);
            return res.status(201).json(created);
        } catch (err) {
            if (err instanceof ExistingProductError) {
                return res.status(409).json({
                    message: err.message
                });
            }
            throw err;
        }
    }

    async update(req: Request, res: Response) {
        const { data } = await validateRequest(req, updateProductSchema);
        try {
            const created = await this.productService.update(data.params.productId, data.body, req.files as Express.Multer.File[]);
            return res.status(201).json(created);

        } catch (err) {
            if (err instanceof ProductNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }
            if (err instanceof ExistingProductError) {
                return res.status(409).json({
                    message: err.message
                });
            }
            throw err;
        }
    }

    async delete(req: Request, res: Response) {
        const { data } = await validateRequest(req, productIdSchema);
        try {
            const created = await this.productService.delete(data.params.productId);
            return res.status(200).json(created);

        } catch (err) {
            if (err instanceof ProductNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }
        }
    }
}
