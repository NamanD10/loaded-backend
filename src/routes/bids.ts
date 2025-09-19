import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireRole, AuthRequest } from "../middlewares/auth";

const prisma = new PrismaClient();
const router = Router();

router.post("/:loadId", authenticate, requireRole("TRANSPORTER"), async (req: AuthRequest, res: Response) => {
  const { transporterId, amount} = req.body;
  const loadId  = parseInt(req.params.id, 10);

  if(!transporterId || !amount || !loadId){
    throw new Error('Bad Request: Request data is not sufficient');
  }

  const bid = await prisma.bid.create({
    data: { 
      loadId: loadId, 
      transporterId: transporterId, 
      amount: amount 
    }
  });

  if(!bid){
    res.status(501).json({
      message:"Could not create bid"
    });
  }
  
  res.status(201).json({
    message: "Bid created successfully",
    bid
  });

});


router.post("/:bidId/accept", authenticate, requireRole("SHIPPER"), async (req: AuthRequest, res: Response) => {
  const bidId = parseInt(req.params.id, 10);

  const bid = await prisma.bid.update({
    where: { id: bidId },
    data: { status: "ACCEPTED" }
  });

  // reject other bids
  await prisma.bid.updateMany({
    where: { loadId: bid.loadId, NOT: { id: bidId } },
    data: { status: "REJECTED" }
  });

  //converting bid to assignment
  const assignment = await prisma.assignment.create({
    data: {
      loadId: bid.loadId,
      bidId: bid.id,
      transporterId: bid.transporterId,
      agreedAmount: bid.amount
    }
  });

  await prisma.load.update({
    where: { id: bid.loadId },
    data: { status: "ASSIGNED" }
  });

  res.json(assignment);
});

export default router;
