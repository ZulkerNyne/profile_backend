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
    const now = new Date().toISOString();
    const newUser ={
        id: users.length +1,
        email, 
        password, 
        fullName, 
        bio: "",
        createdAt: now,
        updatedAt: now,
    };

    users.push(newUser);
    res.status(201).json({
        message:"User registered (fake, not saved yet)",
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

// Fake login routes
app.post("/auth/login",(req,res)=>{
    console.log("Login Body:", req.body);
    const {email, password}=req.body;
    if (!email||!password){
        return res.status(400).json({
            error: "email and password are required",
        });

    }
    const user =users.find((u)=> u.email ===email);
    if (!user){
        return res.status(401).json({
            error: "Invalid email or password",
        });
    }
    if (user.password!==password){
        return res.status(401).json({
            error: "Invalid email or password",
        })
    }
    // no real token yet -just proving login logic 
    return res.json({
        message: "Login successful(fake)",
        user:{
            id: user.id,
            email: user.email,
            fullName: user.fullName,
        },
    });
});
//update user by id
app.patch("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    if (Number.isNaN(id)){
        return res.status(400).json({
            error: "Invalid User id"
        });
    }
    const user =users.find((u)=>u.id ===id);
    if (!user){
        return res.status(404).json({error: "User not found"});
    }
    const {fullName, bio }= req.body;
    //only update fields if provided 
    if (!fullName !=undefined){
        if (typeof fullName!="string"||fullName.trim()===""){
            return res.status(400).json({error: "fullName must be a nonempt string"});
        }
        user.fullName =fullName.trim();
    }
    if (bio !==undefined){
        if (typeof bio != "string"){
            return res.status(400).json({error: "bio must be a string"});
        }
        user.bio =bio;
    }
    user.updatedAt = new Date().toISOString();
    return res.json({
        message: "User updated successfully(In memory)",
        user:{
            id: user.id,
            email: user.email, 
            fullName: user.fullName, 
            bio: user.bio,
            createdAt: user.createdAt, 
            updatedAt: user.updatedAt,
        },
    });
});

//delete user by id 
app.delete("/users/:id", (req,res)=>{
    const id = Number(req.params.id);
    if (Number.isNaN(id)){
        return res.status(400).json({error: "Invalid user id"});

    }
    const index = users.findIndex((u)=>u.id ===id);
    if (index===-1){
        return res.status(400).json({error: "User not found"});
    }
    const deleteUser =users[index];
    users.splice(index,1);
    return res.sendJson({
        message: "User deleted successfully (in memory)",
        deletedUser:{
            id:deleteUser.id,
            email: deleteUser.email,
            fullName: deleteUser.fullName,
        },
    });
});
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});