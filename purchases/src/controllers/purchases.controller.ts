import { Request, Response } from "express";
import { ROLES } from "../constants/role.constant";
import {
  ProductNotFoundError,
  PurchaseNotFoundError,
  PurchaseService,
  purchaseService,
  SupplierNotFoundError,
} from "../services/purchase.service";
import { validateRequest, validateRequestBody, ValidationError } from "../utils/validate-schema";
import {
  purchaseDetailSchema,
  purchaseIdSchema,
  purchaseSchema,
} from "../validations/purchase.schema";

export class PurchasesController {
  constructor(private purchasesService: PurchaseService) {}

  async buy(req: Request, res: Response) {
    
    try {
      const { data } = await validateRequestBody(req, purchaseSchema);
      if (!data?.details || data.details.length < 1) {
        return res.status(400).json({
          message: "Debe comprar al menos un producto",
        });
      }

      const sale = await this.purchasesService.buy(
        data.details,
        data.supplierId
      );

      return res.status(200).json(sale);
    } catch (err) {
      if (
        err instanceof ProductNotFoundError ||
        err instanceof PurchaseNotFoundError ||
        err instanceof SupplierNotFoundError
      ) {
        return res.status(404).json({
          message: err.message,
        });
      }

      if (err instanceof ValidationError) {
        return res.status(400).json(err.issues());
      }

      throw err;
    }
  }

  async findById(req: Request, res: Response) {
    const { data } = await validateRequest(req, purchaseIdSchema);
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        message: "Usuario inválido",
      });
    }

    try {
      if (!data?.params.purchaseId) {
        return res.status(400).json({
          message: "ID de compra inválido",
        });
      }

      const sale = await this.purchasesService.findById(data.params.purchaseId);
      const isAdmin = user.roles.find((r) => r.name == ROLES.ADMIN);

      if (!isAdmin) {
        return res.status(401).json({
          message: "No estás autorizado",
        });
      }

      return res.status(200).json(sale);
    } catch (err) {
      if (err instanceof PurchaseNotFoundError) {
        return res.status(404).json({
          message: err.message,
        });
      }
      throw err;
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const purchases = await this.purchasesService.findAll();
      return res.status(200).json({purchases});
    } catch (err) {
      if (err instanceof PurchaseNotFoundError) {
        return res.status(404).json({
          message: err.message,
        });
      }
      throw err;
    }
  }
}
