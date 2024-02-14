import express, { Request, Response } from 'express';

import { body } from 'express-validator';
import { User } from '../models/user';
import { Password } from '../services/password';
import { BadRequestError, validateRequest } from '@ousstickets/common';
import jwt from 'jsonwebtoken';
const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must apply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await Password.compare(user?.password, password))) {
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
      return res.status(200).send(user);
    }
    throw new BadRequestError('Incorrect email or password');
  }
);

export { router as signinRouter };
