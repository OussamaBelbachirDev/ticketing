import express, { Request, Response, NextFunction } from 'express';
import { Ticket } from '../models/Ticket';

const router = express.Router();

router.get(
  '/api/tickets',
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.find({ orderId: undefined });
    res.send(tickets);
  }
);

export { router as indexTicketRouter };
