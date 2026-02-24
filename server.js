import express from "express";
const app =express();
const PORT = 3000;

app.use(express.json());
// Temporary in-memory storage (Clears when server restarts)
const users =[];
app.get ("/", (req,res)=>{
    res.send("API is running");


});

app.get("/health", (req, res)=>{
    res.json({ ok : true});


});

app.get("/users",(req,res)=>{
    res.json({
        count: users.length,
        users,
    });
});
// View one user by id (option but learning to grasp route params)
app.get("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    if (Number.isNaN(id)){
        return res.status(400).json({error: "Invalid User id"});

    }
    const user =users.find((u)=> u.id ===id);
    if (!user){
        return res.status(404).json({error: "User not found"});
    }
    return res.json(user);
});
// Register route (stores user in memory)
app.post("/auth/register",(req,res)=>{
    console.log("Request Body:",req.body);

    const {email, password, fullName}=req.body;
    if(!email||!password||!fullName){
        return res.status(400).json({
            error: "email, password and fullName are required",
        });
    }
    //duplicate email check 
    const existingUser = users.find((u)=> u.email ===email);
    if (existingUser){
        return res.status(409).json({
            error:"Email already registered",
        });
    }


    //create a new user object (TEMP: plain password for learning only )
    const newUser ={
        id: users.length +1,
        email, 
        password, 
        fullName, 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    res.status(201).json({
        message:"User registered (fake, not saved yet)",
        user:{
            email, 
            fullName,
        },
    });
});
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});