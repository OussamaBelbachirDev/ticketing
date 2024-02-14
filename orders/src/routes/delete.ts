import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@ousstickets/common';
import express, { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) return next(new NotFoundError());

    if (req.currentUser!.id !== order.userId) {
      return next(new NotAuthorizedError());
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publishing an event saying this was cancelled !
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    return res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
