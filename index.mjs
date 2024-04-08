import express from "express";
import cors from "cors";
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";
app.use(express.json());
import bodyParser from "body-parser";
app.use(bodyParser.json());
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/account.js';

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to database"));

app.get("/health", async(req, res)=>{
  res.send({message: "Health OK!"});
})

app.use("/api/auth/", authRoutes);
app.use("/api/account/", accountRoutes);

app.listen(4000, ()=>{
  console.log("Server started on localhost:4000")
})