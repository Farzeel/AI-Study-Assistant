import { Request, Response, NextFunction } from 'express';
import {ZodObject ,  ZodError } from 'zod';


const validate = (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); 

      next();

    } catch (error) {
      
      if (error instanceof ZodError) {
        
        const errors = error.issues.map(err => ({
          field: err.path.join('.'), 
          message: err.message,
        }));

        return res.status(400).json({
          status: 'fail',
          message: 'Validation failed',
          errors: errors,
        });
      }
      
      next(error);
    }
  };

export { validate };