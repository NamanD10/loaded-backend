import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

const prisma = new PrismaClient();
const router = Router();
dotenv.config({path:"../../.env"});

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { 
      name : name,
      email: email, 
      password: hashedPassword, 
      role: role
    }
  });

  if(!user){
        res.status(401).json({
            message: "Could not create user. Please try again"
        });
    }
    
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "SUPER_SECRET_KEY",
    { expiresIn: "7d" } 
  );

  res.status(201).json({
    message: "User created successfully",
    token,
    user
  });

});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique(
    { 
        where: { email: email } 
    });

  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "SUPER_SECRET_KEY",
    { expiresIn: "7d" } 
  );

  res.status(201).json({
    message: "User logged in successfully",
    token,
    user
  });
});

export default router;
