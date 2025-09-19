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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middlewares/auth");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, (0, auth_1.requireRole)("SHIPPER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shipperId, sourceLocation, destinationLocation, weight, typeOfGoods } = req.body;
    const load = yield prisma.load.create({
        data: {
            shipperId: shipperId,
            sourceLocation: sourceLocation,
            destinationLocation: destinationLocation,
            weight: weight,
            typeOfGoods: typeOfGoods,
        }
    });
    if (!load) {
        res.status(401).json({
            message: "Could not create load. Please try again"
        });
    }
    res.status(201).json({
        message: "Load created successfully",
        load
    });
}));
router.get("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, source, destination } = req.query;
        const user = req.user;
        let where = {};
        // Filtering by status if provided
        if (status) {
            where.status = String(status).toUpperCase();
        }
        // Filtering by location if provided
        if (source) {
            where.sourceLocation = { contains: String(source), mode: "insensitive" };
        }
        if (destination) {
            where.destinationLocation = { contains: String(destination), mode: "insensitive" };
        }
        // Role-based logic
        if (user.role === "SHIPPER") {
            // Show only this shipper's loads
            where.shipperId = user.userId;
        }
        else if (user.role === "TRANSPORTER") {
            // Show all open loads by default if no filter applied
            if (!status)
                where.status = "OPEN";
        }
        const loads = yield prisma.load.findMany({
            where,
            include: {
                shipper: { select: { id: true, name: true } },
                bids: true
            },
            orderBy: { createdAt: "desc" }
        });
        res.json(loads);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
}));
router.get("/:id", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loadId = parseInt(req.params.id);
    const load = yield prisma.load.findUnique({
        where: { id: loadId }
    });
    res.json(load);
}));
exports.default = router;
