import express from "express";
const app =express();
const PORT = 3000;

app.use(express.json());

app.get ("/", (req,res)=>{
    res.send("API is running");


});

app.get("/health", (req, res)=>{
    res.json({ ok : true});


});

app.post("/auth/register",(req,res)=>{
    console.log("Request Body:",req.body);

    const {email, password, fullName}=req.body;
    if(!email||!password||!fullName){
        return res.status(400).json({
            error: "email, password and fullName are required",
        });
    }
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