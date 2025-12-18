import multer, { FileFilterCallback } from 'multer';
import { documentStorage } from '../config/cloudinary';
import { AppError } from '../utils/AppError';
import { Request } from 'express';

const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new AppError('Only PDF files are allowed', 400));
      return;
    }
    cb(null, true);
  },
});

export default uploadDocument;
