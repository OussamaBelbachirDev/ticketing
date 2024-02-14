import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@ousstickets/common';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use !');
    }

    const user = User.build({ email, password });
    await user.save();

    // ======== JWT
    // if (!process.env.JWT_KEY) throw new Error('');
    console.log('🫶 🫶 🫶 🫶 🫶 ', process.env.JWT_KEY!);

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on Session obg
    req.session = {
      jwt: token,
    };

    return res.status(201).send(user);
  }
);

export { router as signupRouter };
