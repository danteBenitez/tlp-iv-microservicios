import { Request, Response } from "express";
import { validateRequest, validateRequestBody } from "../utils/validate-schema";
import {
  ConflictingSupplierError,
  InvalidDataError,
  SupplierNotFoundError,
  SuppliersService,
} from "../services/supplier.service";
import {
  createSupplierSchema,
  SupplierIdSchema,
  updateSupplierSchema,
} from "../validations/supplier.schema";

export class SupplierController {
  constructor(private supplierService: SuppliersService) {}
 
  async findAllSuppliers(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        message: "Usuario no autenticado",
      });
    }

    const suppliers = await this.supplierService.findAll();

    return res.status(200).json({
      suppliers,
    });
  }

  async findById(req: Request, res: Response) {
    const { data, error, success } = await validateRequest(
      req,
      SupplierIdSchema
    );
    if (!success) {
      return res.status(400).json(error);
    }
    const supplier = await this.supplierService.findById(
      data.params.supplierId
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Proveedor no encontrado",
      });
    }

    res.status(200).json({ supplier });
  }

  async delete(req: Request, res: Response) {
    const { data, error, success } = await validateRequest(
      req,
      SupplierIdSchema
    );
    if (!success) {
      return res.status(400).json(error);
    }

    try {
      const deleted = await this.supplierService.delete(data.params.supplierId);

      if (!deleted) {
        return res.status(404).json({
          message: "Proveedor no encontrado",
        });
      }

      return res.status(200).json({
        message: "Proveedor eliminado exitosamente",
      });
    } catch (err) {
      if (err instanceof ConflictingSupplierError) {
        return res.status(409).json({
          message: err.message,
        });
      }

      if (err instanceof SupplierNotFoundError) {
        return res.status(404).json({
          message: err.message,
        });
      }
      
      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  async create(req: Request, res: Response) {
    const { data, success, error } = await validateRequestBody(
      req,
      createSupplierSchema
    );
    if (!success) {
      return res.status(400).json(error);
    }

    try {
      const supplier = await this.supplierService.create(data);

      return res.status(201).json(supplier);
    } catch (err) {
      if (err instanceof ConflictingSupplierError) {
        return res.status(409).json({
          message: err.message,
        });
      }

      console.error("Error al crear proveedor: ", err);
      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }

  async update(req: Request, res: Response) {
    const { data, success, error } = await validateRequest(
      req,
      updateSupplierSchema
    );
    if (!success) {
      return res.status(400).json(error);
    }

    if (!data.body) {
      throw new InvalidDataError("No se proporcionaron datos para actualizar");
    }

    const updated = await this.supplierService.update(
      data.params.supplierId,
      data.body
    );

    if (!updated) {
      return res.status(404).json({
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json(updated);
  }
}
