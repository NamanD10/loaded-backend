"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
dotenv_1.default.config({ path: "../../.env" });
// Signup
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const user = yield prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        }
    });
    if (!user) {
        res.status(401).json({
            message: "Could not create user. Please try again"
        });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "SUPER_SECRET_KEY", { expiresIn: "7d" });
    res.status(201).json({
        message: "User created successfully",
        token
    });
}));
// Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: { email: email }
    });
    if (!user)
        return res.status(404).json({ error: "User not found" });
    const valid = yield bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "SUPER_SECRET_KEY", { expiresIn: "7d" });
    res.status(201).json({
        message: "User logged in successfully",
        token
    });
}));
exports.default = router;
