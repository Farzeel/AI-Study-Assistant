import { NextFunction,Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import bcrypt from 'bcryptjs';
import { AuthRequest } from "../middleware/auth.middleware";
import { cloudinary } from "../config/cloudinary";
import { prisma } from "../server";



const safeUserSelect = {
    id: true,
    email: true,
    name: true,
    avatar: true,
    role: true,
    plan: true,
    tokensUsed: true, 
    monthlyLimit: true, 
    createdAt: true,
    updatedAt: true,

};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        
        const userId = req.user.id ; 

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: safeUserSelect, 
        });

        if (!user) {
          
            return next(new AppError('User not found.', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { user },
        });

    } catch (error) {
        next(error);
    }
};




export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id; 
        
    
        const allowedUpdates = ['name']; 
        const updates: { [key: string]: any } = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (Object.keys(updates).length === 0) {
            return next(new AppError('No valid fields provided for update.', 400));
        }
        
        // 2. Perform the update
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updates,
            select: safeUserSelect, 
        });

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully.',
            data: { user: updatedUser },
        });

    } catch (error) {
        next(error);
    }
};

export const uploadAvatar = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // 1️⃣ Check if file exists
      if (!req.file) {
        return next(new AppError('Please upload an image file', 400));
      }
  
      const userId = req.user.id;
  
      // 2️⃣ Get current user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatar: true, avatarCloudID: true },
      });
  
      if (!user) {
        return next(new AppError('User not found', 404));
      }
  
    
      if (user.avatarCloudID) {
        await cloudinary.uploader.destroy(user.avatarCloudID);
      }
  
     
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          avatar: req.file.path,         
          avatarCloudID: req.file.filename, 
        },
        select: {
          id: true,
          avatar: true,
        },
      });
  
     
      res.status(200).json({
        message: 'Avatar uploaded successfully',
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };


  export const deleteAccount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id;
      const { password } = req.body;
  
      
      if (!password) {
        return next(new AppError('Password confirmation required', 400));
      }
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user || user.deletedAt) {
        return next(new AppError('User not found', 404));
      }
  
      
      const isMatch = await bcrypt.compare(password, user.password!);
      if (!isMatch) {
        return next(new AppError('Invalid password', 401));
      }
  
     
      if (user.avatarCloudId) {
        await cloudinary.uploader.destroy(user.avatarCloudId);
      }
  
      await prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
          isActive: false,
          refreshToken: "",
        },
      });
  
      
      res.clearCookie('jwt');
      res.clearCookie('refreshToken');
  
      res.status(200).json({
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
  