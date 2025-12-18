import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import jwt from "jsonwebtoken"

export const generateId = () => uuidv4();
import dotenv from "dotenv"

dotenv.config()

export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    const bcrypt = await import('bcryptjs');
    return bcrypt.compare(password, hashedPassword);
  };

  export const generateToken = (userId: string): any => {

    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: "10m"
    });
  };

  export const signRefreshToken = (id:string) => {
    return jwt.sign({ id }, process.env.REFRESH_SECRET!, {
        expiresIn: "7d",
      });
}

  export const calculateTokens = (text: string): number => {
    // Approximate token count (4 chars = 1 token)
    return Math.ceil(text.length / 4);
  };

  export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

