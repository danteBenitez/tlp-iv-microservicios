import { z } from "zod";
import { config } from "../config/config.service.js";
import {
  ISupplierRepository,
  supplierRepository as supplierRepository_,
} from "../repositories/supplier.repository.js";
import { ISupplier } from "../interfaces/supplier.interface.js";
import { CreateSupplierData, UpdateSupplierData } from "../validations/supplier.schema.js";

export class ConflictingSupplierError extends Error {}
export class SupplierNotFoundError extends Error {}
export class InvalidDataError extends Error {}

export class SuppliersService {
  constructor(
    private supplierRepository: ISupplierRepository = supplierRepository_
  ) {}

  /**
   * Encuentra y retorna todos los usuarios.
   *
   */
  async findAll(): Promise<ISupplier[]> {
    const suppliers = await this.supplierRepository.findAll();
    return suppliers;
  }

  /**
   * Encuentra y retorna un usuario por su ID
   */
  async findById(supplierId: string) {
    const supplier = await this.supplierRepository.findById(supplierId);
    return supplier;
  }

  async create(supplierData: CreateSupplierData) {
    const supplier = await this.supplierRepository.findByName(
      supplierData.body.companyName
    );

    if (supplier) {
      throw new ConflictingSupplierError(
        "Ya existe un proveedor con el nombre de empresa proporcionado"
      );
    }

    const newSupplier = await this.supplierRepository.create({
      ...supplierData.body,
    });

    return newSupplier;
  }

  async update(supplierId: string, supplierData: UpdateSupplierData) {
    const supplier = await this.supplierRepository.findById(supplierId);

    if (!supplier) {
      throw new SupplierNotFoundError("Proveedor no encontrado");
    }

    const updatedSupplier = await this.supplierRepository.update(supplierId, {
      ...supplierData,
    });

    return updatedSupplier;
  }


  async findByName(companyName: string) {
    return this.supplierRepository.findByName(companyName);
  }

  async delete(supplierId: string) {
    const supplier = await this.supplierRepository.findById(supplierId);

    if (!supplier) {
      throw new SupplierNotFoundError("Proveedor no encontrado.");
    }
    return this.supplierRepository.delete(supplierId);
  }
}

export const suppliersService = new SuppliersService();
