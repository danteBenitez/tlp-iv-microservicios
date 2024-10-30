import multer, { diskStorage } from "multer";
import { TEMP_UPLOAD_PATH } from "../services/file.service";

export const uploadMiddleware = multer({
    storage: diskStorage({
        destination: TEMP_UPLOAD_PATH,
        filename(req, file, callback) {
            callback(null, `${Date.now()}-${file.originalname}`);
        },
    })
})