import { Request, Response } from "express";
import { ShipmentNotFoundError, ShipmentService, shipmentService as shipmentService_ } from "../services/shipment.service";

export class ShipmentController {

    constructor(private shipmentService: ShipmentService = shipmentService_) { }

    async findForUser(req: Request, res: Response) {
        const userId = req.headers["x-authentication-id"];
        console.log(req.headers, { userId });

        if (!userId) {
            return res.status(401).json({
                message: "Usuario inválido"
            });
        }

        if (typeof userId != "string") {
            return res.status(400).json({
                message: "ID de usuario inválida"
            });
        }

        try {
            const shipments = await this.shipmentService.findForUser(userId);
            res.status(200).json(shipments);
        } catch (err) {
            if (err instanceof ShipmentNotFoundError) {
                return res.status(404).json({
                    message: err.message
                });
            }
            throw err;
        }
    }
}