import express from 'express';
const router = express.Router();

import { currentUser } from '@ousstickets/common';

router.get('/api/users/currentuser', currentUser, async (req, res) => {
  return res.send({ currentUser: req.currentUser ? req.currentUser : null });
});

export { router as currentUserRouter };
