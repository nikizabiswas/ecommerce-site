import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();

  await Product.insertMany([
    { name:"Laptop", price:45000, category:"Electronics", description:"High performance laptop", image:"images/laptop.jpg" },
    { name:"Headphones", price:1500, category:"Accessories", description:"Noise cancelling headphones", image:"images/headphones.jpg" },
    { name:"Phone", price:25000, category:"Mobiles", description:"Android smartphone", image:"images/phone.jpg" }
  ]);

  console.log("Seeding done!");
  process.exit();
}

seed();
