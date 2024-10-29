import { Op } from "sequelize";

import { ISupplier } from "../interfaces/supplier.interface";
import Supplier from "../models/supplier.model";

export interface ISupplierRepository {
  /** Retorna un proveedor por ID */
  findById(supplierID: string): Promise<ISupplier | null>;

  /** Retorna un proveedor por su nombre */
  findByName(companyName: string): Promise<ISupplier | null>;

  /** Retorna todos los proveedores*/
  findAll(): Promise<ISupplier[]>;

  update(
    supplierID: string,
    user: Partial<ISupplier>
  ): Promise<ISupplier | null>;

  create(supplierData: Omit<ISupplier, "supplierId">): Promise<ISupplier>;
  delete(supplierID: string): Promise<ISupplier | null>;
}

export class PostgresRepository implements ISupplierRepository {
  constructor(private supplierModel: typeof Supplier = Supplier) {}

  findById(supplierID: string): Promise<ISupplier | null> {
    return this.supplierModel.findByPk(supplierID);
  }

  findByName(companyName: string): Promise<ISupplier | null> {
    return this.supplierModel.findOne({
      where: { companyName },
    });
  }

  findAll(): Promise<ISupplier[]> {
    return this.supplierModel.findAll();
  }

  create(supplierData: Omit<ISupplier, "supplierID">): Promise<ISupplier> {
    return this.supplierModel.create({
      ...supplierData,
    });
  }

  async delete(supplierID: string): Promise<ISupplier | null> {
    const found = await this.supplierModel.findByPk(supplierID);
    if (!found) return null;
    await found.destroy();
    return found;
  }

  async update(
    supplierID: string,
    user: Partial<ISupplier>
  ): Promise<ISupplier | null> {
    const found = await this.supplierModel.findByPk(supplierID);
    await found?.update(user);
    return this.findById(supplierID);
  }
}

export const supplierRepository = new PostgresRepository();
