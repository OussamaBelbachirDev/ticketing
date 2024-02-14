import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@ousstickets/common';
import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      .withMessage('TicketId must be provided  !')
      .isMongoId()
      .withMessage('Invalid Ticket Id'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return next(new NotFoundError());

    // Make sure that this ticket is not already reserved
    if (await ticket.isReserved()) {
      return next(new BadRequestError('Ticket is already reserved !'));
    }

    // Calculate an expiration date for this order
    const expriration = new Date();
    expriration.setSeconds(expriration.getSeconds() + 1 * 60);

    // Build the order and save it to the database

    const order = Order.build({
      ticket,
      status: OrderStatus.Created,
      expiresAt: expriration,
      userId: req.currentUser!.id,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Created,
      version: order.version,
      userId: req.currentUser!.id,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
