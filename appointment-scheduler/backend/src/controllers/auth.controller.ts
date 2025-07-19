import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "ADMIN") {
      console.log("User role:", user.role);
      return res
        .status(401)
        .json({ message: "Access denied. Admin role required." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("Login successful for user:", email);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
