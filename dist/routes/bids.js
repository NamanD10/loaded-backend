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
router.post("/:loadId", auth_1.authenticate, (0, auth_1.requireRole)("TRANSPORTER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transporterId, amount } = req.body;
    const loadId = parseInt(req.params.id, 10);
    if (!transporterId || !amount || !loadId) {
        throw new Error('Bad Request: Request data is not sufficient');
    }
    const bid = yield prisma.bid.create({
        data: {
            loadId: loadId,
            transporterId: transporterId,
            amount: amount
        }
    });
    if (!bid) {
        res.status(501).json({
            message: "Could not create bid"
        });
    }
    res.status(201).json({
        message: "Bid created successfully",
        bid
    });
}));
router.post("/:bidId/accept", auth_1.authenticate, (0, auth_1.requireRole)("SHIPPER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bidId = parseInt(req.params.id, 10);
    const bid = yield prisma.bid.update({
        where: { id: bidId },
        data: { status: "ACCEPTED" }
    });
    // reject other bids
    yield prisma.bid.updateMany({
        where: { loadId: bid.loadId, NOT: { id: bidId } },
        data: { status: "REJECTED" }
    });
    //converting bid to assignment
    const assignment = yield prisma.assignment.create({
        data: {
            loadId: bid.loadId,
            bidId: bid.id,
            transporterId: bid.transporterId,
            agreedAmount: bid.amount
        }
    });
    yield prisma.load.update({
        where: { id: bid.loadId },
        data: { status: "ASSIGNED" }
    });
    res.json(assignment);
}));
exports.default = router;
