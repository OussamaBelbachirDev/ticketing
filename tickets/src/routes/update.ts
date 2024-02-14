import express, { Request, Response, NextFunction } from 'express';
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  validateRequest,
  BadRequestError,
} from '@ousstickets/common';
import { Ticket } from '../models/Ticket';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title must be provided'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) return next(new NotFoundError());

    if (ticket.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    if (ticket.orderId) {
      return next(new BadRequestError('Cannot edit a reserved ticket !'));
    }

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
