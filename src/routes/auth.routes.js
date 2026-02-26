import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const router = Router();

const users = globalThis.__users || (globalThis.__users=[]);

router.post("/register",async(req,res)=>{
    const {email, password, fullName}=req.body;
    if (!email || ! password || ! fullName){
        return res.status(400).json({
            error: "email, password and fullName are required",
        });
    }
    const existingUser = users.find((u)=>u.email===email);
    if (existingUser){
        return res.status(409).json({
            error: "Email alreaedy registered"
        });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const newUser={
        id: users.length+1,
        email, 
        passwordHash,
        fullName,
        bio:"",
        createdAt: now,
        updatedAt: now,
    };
    users.push(newUser);
    return res.status(201).json({
        message:"User registered successfully hashed password ",
        user:{
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            bio: newUser.bio,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,

        },
    });
});

router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    

    if (!email||!password){
        return res.status(400).json({
            error: "email and password are required"
        });
    }
    const user =users.find((u)=>u.email ===email);
    if (!user){
        return res.status(401).json({error: "Invalid email or password"});
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok){
        return res.status(401).json({error: "Invalid email or password"});
    }
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
);

    return res.json({
        message: "Login successful",
        token,
});
});

export default router;