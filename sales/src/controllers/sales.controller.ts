import { Request, Response } from "express";
import { ROLES } from "../constants/role.constant";
import {
  ProductNotFoundError,
  ProductOutOfStockError,
  SaleNotFoundError,
  saleService,
  SaleService,
  UserNotFoundError,
} from "../services/sale.service";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import { saleIdSchema, saleSchema } from "../validations/sale.schema";

export class SalesController {
  constructor(private salesService: SaleService = saleService) { }


  async sell(req: Request, res: Response) {
    const { data } = await validateRequestBody(req, saleSchema);
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        message: "Usuario inválido"
      });
    }

    try {
      const sale = await this.salesService.sell(data.items, user, data.address);

      return res.status(200).json(sale);

    } catch (err) {
      if (
        err instanceof ProductNotFoundError ||
        err instanceof SaleNotFoundError ||
        err instanceof UserNotFoundError
      ) {
        return res.status(404).json({
          message: err.message
        });
      }

      if (err instanceof ProductOutOfStockError) {
        return res.status(400).json({
          message: err.message
        });
      }
      throw err;
    }
  }

  async findById(req: Request, res: Response) {
    const { data } = await validateRequest(req, saleIdSchema);
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        message: "Usuario inválido",
      });
    }

    try {
      const sale = await this.salesService.findById(data.params.saleId);
      const isAdmin = user.roles.find((r) => r.name == ROLES.ADMIN);

      if (!isAdmin && user?.userId.toString() != sale.userId) {
        return res.status(401).json({
          message: "No estás autorizado",
        });
      }

      return res.status(200).json(sale);
    } catch (err) {
      if (err instanceof SaleNotFoundError) {
        return res.status(404).json({
          message: err.message,
        });
      }
      throw err;
    }
  }

  async findMine(req: Request, res: Response) {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        message: "Usuario inválido",
      });
    }

    try {
      const sale = await this.salesService.findForUser(user.userId.toString());
      console.log(sale);
      return res.status(200).json(sale);
    } catch (err) {
      if (err instanceof SaleNotFoundError) {
        return res.status(404).json({
          message: err.message,
        });
      }
      throw err;
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const sales = await this.salesService.findAll();
      return res.status(200).json(sales);
    } catch (err) {
      if (err instanceof SaleNotFoundError) {
        return res.status(404).json({
          message: err.message,
        });
      }
      throw err;
    }
  }
}
