import { NextFunction,Request , Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken"
import { comparePassword, generateToken, hashPassword, signRefreshToken } from "../utils/helpers";
import { verifyGoogleToken } from "../utils/google";
import { prisma } from "../server";


export const safeUserSelect = {
    id: true,
    email: true,
    name: true,
    avatar: true,
    role: true,
    plan: true,
    createdAt: true,
    updatedAt: true,
};
export const register = async (req:Request,res:Response,next:NextFunction)=>{

    try {
        
        const {  email, password } = req.body;
        if(!email || !password){
            throw new AppError('please fill all fields', 400);
        }

        const existingUser = await prisma.user.findFirst ({where: {email} });
        if (existingUser) {
            throw new AppError('Email already in use', 400);
          }

          const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
         data: {  
            name: email.split("@")[0],
            email,
            password: hashedPassword
        },
        select:safeUserSelect
          });

    
        res.status(201).json({
            status: 'success',
            data: {
              user: newUser
            }
          });
        
    
    } catch (error) {
        next(error);
    }
    }

    export const login = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          throw new AppError("Please fill all fields", 400);
        }
    
        const user = await prisma.user.findUnique({ where: { email } });
    
        if (!user || !(await comparePassword(password, user.password!))) {
          throw new AppError("Incorrect email or password", 401);
        }
    
        if (user.isBlock || !user.isActive || user.deletedAt) {
          throw new AppError("Account is inactive or blocked.", 403);
        }
    
        const accessToken = generateToken(user.id);
        const refreshToken = signRefreshToken(user.id);
    
        // 🔥 CREATE SESSION
        await prisma.session.create({
          data: {
            userId: user.id,
            refreshToken,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
    
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    
        res.status(200).json({
          status: "success",
          accessToken,
          user: {
            ...user,
            password: undefined,
          },
        });
      } catch (err) {
        next(err);
      }
    };
    
   
  export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new AppError("ID token required", 400);

    const googleUser = await verifyGoogleToken(idToken);

    let provider = await prisma.userProvider.findUnique({
      where: {
        provider_providerId: {
          provider: "GOOGLE",
          providerId: googleUser.googleId,
        },
      },
      include: { user: true },
    });

    let user;
    if (provider) {
       
      user = {
          id: provider.user.id,
          email: provider.user.email,
          name: provider.user.name,
          avatar: provider.user.avatar,
          role: provider.user.role,
          plan: provider.user.plan,
          createdAt: provider.user.createdAt,
          updatedAt: provider.user.updatedAt,
      };
    }else{
  
          user = await prisma.user.create({
            data: {
              email: googleUser.email,
              name: googleUser.name,
              avatar: googleUser.avatar,
            },
          });
        
  
        await prisma.userProvider.create({
          data: {
            userId: user.id,
            provider: "GOOGLE",
            providerId: googleUser.googleId,
          },
        });
      
    }




    const accessToken = generateToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    // 🔥 CREATE SESSION
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        userAgent: req.headers["user-agent"] ?? null, 
        ipAddress: req.ip ?? null,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      accessToken,
      user,
    });
  } catch (err) {
    next(err);
  }
};


export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.jwt;

  if (refreshToken) {
    await prisma.session.deleteMany({
      where: { refreshToken },
    });
  }

  res.clearCookie("jwt");

  res.status(200).json({ status: "success" });
};


      
      
      export const refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
          const refreshToken = req.cookies?.jwt;
          if (!refreshToken) {
            throw new AppError("Please log in", 401);
          }
      
          let payload: { id: string; exp: number };
          try {
            payload = jwt.verify(
              refreshToken,
              process.env.REFRESH_SECRET!
            ) as any;
          } catch {
            throw new AppError("Invalid or expired refresh token", 401);
          }
      
          const session = await prisma.session.findUnique({
            where: { refreshToken },
            include: { user: { select: safeUserSelect } },
          });
      
          if (!session || session.userId !== payload.id) {
            res.clearCookie("jwt");
            throw new AppError("Session invalid", 401);
          }
      
          if (session.expiresAt < new Date()) {
            await prisma.session.delete({ where: { id: session.id } });
            throw new AppError("Session expired", 401);
          }
      
          const newAccessToken = generateToken(session.userId);
          const newRefreshToken = signRefreshToken(session.userId);
      
          // 🔄 ROTATE SESSION TOKEN
          await prisma.session.update({
            where: { id: session.id },
            data: {
              refreshToken: newRefreshToken,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
      
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
      
          res.status(200).json({
            status: "success",
            accessToken: newAccessToken,
            user: session.user,
          });
        } catch (err) {
          next(err);
        }
      };
      
      
    
    
