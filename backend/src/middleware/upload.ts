// middleware/upload.ts
import { storage } from '../config/cloudinary';
import multer, { FileFilterCallback } from 'multer';
import { AppError } from '../utils/AppError';
import { Request } from 'express';


const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, 
  fileFilter: (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/i)) {
      cb(new AppError('Invalid file type. Only JPEG, PNG, and WebP are allowed.',400));
      return;
    }
    cb(null, true);
  },
});

export default upload;