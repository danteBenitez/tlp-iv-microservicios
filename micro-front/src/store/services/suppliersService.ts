import { AxiosError } from "axios";
import axiosInstance from "../actionAxios";

export const getSuppliers = async () => {
  try {
    const response = await axiosInstance.get("/suppliers");
    console.log("getSuppliers", response.data);

    return response.data.suppliers;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status == 404) {
        return [];
      }
    }
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getSupplierById = async (supplierId: string) => {
  try {
    const response = await axiosInstance.get(`/suppliers/${supplierId}`);
    console.log("getSupplierById", response.data);

    return response.data.supplier;
  } catch (error) {
    console.error("Error fetching supplier by ID:", error);
    throw error;
  }
};

export type TSupplierCreateData = {
  supplierId?: string;
  companyName: string;
  cuit: string;
  phoneNumber: string;
  address: string;
  email: string;
};

export const createSupplier = async (supplierData: TSupplierCreateData) => {
  try {
    const response = await axiosInstance.post("/suppliers/", supplierData);
    console.log("createSupplier", response.data);

    return response.data;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};

export type TSupplierUpdateData = Partial<TSupplierCreateData>;

export const updateSupplier = async (
  supplierId: string,
  supplierData: TSupplierUpdateData
) => {
  try {
    const response = await axiosInstance.patch(
      `/suppliers/${supplierId}`,
      supplierData
    );
    console.log("updateSupplier", response.data);

    return response.data;
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw error;
  }
};

export const deleteSupplier = async (supplierId: string) => {
  try {
    const response = await axiosInstance.delete(`/suppliers/${supplierId}`);
    console.log("deleteSupplier", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw error;
  }
};
