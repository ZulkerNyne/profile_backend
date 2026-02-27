import {z} from "zod";

export const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters "),
    fullName: z.string().min(1, "fullName is required"),

});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "password is required"),
    
});