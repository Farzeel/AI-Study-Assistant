
import {z} from "zod"

// Define the Zod schema for user registration
export const registerSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters long"),

    email: z.email("Invalid email format"),

    password: z.string()
        .min(5, "Password must be at least 5 characters long")
        .regex(/[0-9]/, "Password must contain a number")
        .regex(/[a-zA-Z]/, "Password must contain a letter")
});
export const loginSchema = z.object({


    email: z.email("Invalid email format"),

    password: z.string()
        .min(1, "Password must be at least 1 character long")
       
});
