import { FileInterceptor } from "@nestjs/platform-express";
import {memoryStorage} from "multer";

const storage = memoryStorage()

export const UploadImageInterceptor = FileInterceptor('image',{storage});