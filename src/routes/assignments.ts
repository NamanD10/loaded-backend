import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest, requireRole } from "../middlewares/auth";

const prisma = new PrismaClient();
const router = Router();

// Get all assignments
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  
  const assignments = await prisma.assignment.findMany({
    include: { load: true, transporter: true }
  });
  if(!assignments){
    res.status(404).json({
      message:"Can not find assignments"
    })
  }
  res.status(201).json({
    message:"Assignment created successfully",
    assignments
  });
});

// Update assignment status
router.patch("/:id/status", authenticate, requireRole("TRANSPORTER"), async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const assignmentId = parseInt(req.params.id, 10);

  if(!assignmentId){
    res.status(400).json({
      message:"Could not get id from request parameters"
    });
  }
  if(isNaN(assignmentId)){
     res.status(400).json({
      message:"Make sure id is a number"
    });
  }
  
  const assignment = await prisma.assignment.update({
    where: { id: assignmentId },
    data: { status }
  });

  if(!assignment){
    res.status(501).json({
      message:"Could not update assignment status"
    });
  }
  
  res.status(201).json({
    message:"Assignment created successfully",
    assignment
  });
});

export default router;
