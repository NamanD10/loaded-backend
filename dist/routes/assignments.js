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
// Get all assignments
router.get("/", auth_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const assignments = yield prisma.assignment.findMany({
        include: { load: true, transporter: true }
    });
    if (!assignments) {
        res.status(404).json({
            message: "Can not find assignments"
        });
    }
    res.status(201).json({
        message: "Assignment created successfully",
        assignments
    });
}));
// Update assignment status
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.requireRole)("TRANSPORTER"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    const assignmentId = parseInt(req.params.id, 10);
    if (!assignmentId) {
        res.status(400).json({
            message: "Could not get id from request parameters"
        });
    }
    if (isNaN(assignmentId)) {
        res.status(400).json({
            message: "Make sure id is a number"
        });
    }
    const assignment = yield prisma.assignment.update({
        where: { id: assignmentId },
        data: { status }
    });
    if (!assignment) {
        res.status(501).json({
            message: "Could not update assignment status"
        });
    }
    res.status(201).json({
        message: "Assignment created successfully",
        assignment
    });
}));
exports.default = router;
