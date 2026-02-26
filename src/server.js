import "dotenv/config";
console.log("JWT_SECRET loaded?", Boolean(process.env.JWT_SECRET));
import app from "./app.js";
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});