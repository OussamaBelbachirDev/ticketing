import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@ousstickets/common';
import express, { Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order';
const router = express.Router();

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) return next(new NotFoundError());
    if (req.currentUser!.id !== order.userId) {
      return next(new NotAuthorizedError());
    }

    return res.send(order);
  }
);

export { router as showOrderRouter };
