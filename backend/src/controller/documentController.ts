import { Request, Response ,NextFunction } from "express"
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../utils/AppError";
import { PrismaClient } from "@prisma/client";
import { formatBytes } from "../utils/helpers";
import { inngest } from "../inngest";
import { prisma } from "../server";



export const createDocumentController = async (
    req: AuthRequest,
    res: Response,
    next:NextFunction
  ) => {


    const userId = req.user.id;

    if (!req.file) {
      throw new AppError("PDF file is required", 400);
    }

    const {
        originalname,
        path: fileUrl,
        filename: cloudinaryId,
        size: fileSize,
      } = req.file;


      console.log(req.file)
    const pdfSize = formatBytes(fileSize)

      const document = await prisma.document.create({
        data: {
          userId,
          title: originalname.replace(/\.pdf$/i, ""),
          fileName: originalname,
          fileUrl,
          cloudinaryId,
          fileSize:pdfSize,
          pages: 0,
          processing: "PENDING",
        },
      });

      await inngest.send({
        name: "document/index.requested",
        data: {
          documentId: document.id,
          userId,
          fileUrl,
        },
      });

      res.status(202).json({
        message: "Document uploaded. Processing started.",
        documentId: document.id,
        size:document.fileSize,
        status: "PENDING",
      });

  }

