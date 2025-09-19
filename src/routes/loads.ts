import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireRole, AuthRequest } from "../middlewares/auth";

const prisma = new PrismaClient();
const router = Router();

router.post("/", authenticate, requireRole("SHIPPER"), async(req: AuthRequest, res: Response) => {
    const {shipperId, sourceLocation, destinationLocation, weight, typeOfGoods} = req.body;
    
    const load = await prisma.load.create ({
        data: {
            shipperId: shipperId,
            sourceLocation: sourceLocation,
            destinationLocation: destinationLocation,
            weight: weight,
            typeOfGoods: typeOfGoods,
        } 
        
    });
   
    if(!load){
        res.status(401).json({
            message: "Could not create load. Please try again"
        });
    }
    
    res.status(201).json({
        message: "Load created successfully",
        load
    });

});

router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const { status, source, destination } = req.query;
    const user = req.user!;

    let where: any = {};

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
    } else if (user.role === "TRANSPORTER") {
      // Show all open loads by default if no filter applied
      if (!status) where.status = "OPEN";
    }

    const loads = await prisma.load.findMany({
      where,
      include: {
        shipper: { select: { id: true, name: true } },
        bids: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(loads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
    const loadId = parseInt(req.params.id);

    const load = await prisma.load.findUnique ({
        where: {id : loadId}
    });

    res.json(load);
});

export default router;