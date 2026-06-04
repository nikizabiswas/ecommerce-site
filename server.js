import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req,res)=>res.send("Backend Running"));

app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
