import * as fs from 'fs/promises';
import * as path from "path";

export const UPLOAD_PATH = "./uploads";
export const TEMP_UPLOAD_PATH = "./uploads/temp";

type UploadResult = {
    /** The filename as generated by the DiskStorage engine. This is a path into a tmp folder */
    filename: string,
    /** The original filename, the one on the uploader's computer */
    originalFilename: string
}

export class FileNotFoundError extends Error { }

export class FilesService {

    async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
        const filename = file.filename;
        const filePath = this.#resolveToTemp(filename);
        await fs.rename(filePath, this.#resolveFile(file.originalname));
        return {
            filename: file.originalname,
            originalFilename: file.originalname,
        };
    }

    async removeFile(filename: string): Promise<boolean> {
        await fs.unlink(this.#resolveFile(filename));
        return true;
    }


    async readFile(filename: string) {
        try {
            const file = await fs.readFile(this.#resolveFile(filename));
            return file;
        } catch (err) {
            console.error(err);
            throw new FileNotFoundError("Archivo no encontrado");
        }
    }

    #resolveFile(filename: string) {
        return path.resolve(UPLOAD_PATH, filename);
    }

    #resolveToTemp(filename: string) {
        return path.resolve(TEMP_UPLOAD_PATH, filename);
    }
}

export const fileService = new FilesService();