import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { adapter } from '../server';

const prisma = new PrismaClient({adapter});

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        tokensUsed: true,
        monthlyLimit: true
      }
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};


// export const checkPlanLimit = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = req.user;
    
//     // Reset tokens at beginning of month
//     const now = new Date();
//     const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    
//     if (user.tokensUsed >= user.monthlyLimit) {
//       return res.status(429).json({
//         error: 'Monthly limit reached. Please upgrade your plan.'
//       });
//     }
    
//     next();
//   } catch (error) {
//     next(error);
//   }
// };