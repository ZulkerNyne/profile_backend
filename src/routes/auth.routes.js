import { Router } from "express";

const router = Router();

const users = globalThis.__users || (globalThis.__users=[]);

router.post("/register",(req,res)=>{
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
    const now = new Date().toISOString();
    const newUser={
        id: users.length+1,
        email, 
        password,
        fullName,
        bio:"",
        createdAt: now,
        updatedAt: now,
    };
    users.push(newUser);
    return res.status(201).json({
        message:"User registered successfully ",
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

router.post("/login",(req,res)=>{
    const {email,password}=req.body;
    

    if (!email||!password){
        return res.status(400).json({
            error: "email and password are required"
        });
    }
    const user =users.find((u)=>u.email ===email);
    if (!user || user.password !== password){
        return res.status(401).json({error: "Invalid email or password"});
    }
    return res.json({
        message: "Login successful (fake)",
        user: {id: user.id, email: user.email, fullName: user.fullName},
    });
});

export default router;