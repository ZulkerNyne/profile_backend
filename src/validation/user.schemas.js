import {z} from "zod";
export const updateMeSchema = z.object({
    fullName: z.string().min(1).optional(),
    bio : z.string().optional(),
}).strict();