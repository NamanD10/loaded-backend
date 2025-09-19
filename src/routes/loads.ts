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

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
    const loadId = parseInt(req.params.id);

    const load = await prisma.load.findUnique ({
        where: {id : loadId}
    });

    res.json(load);
});

export default router;