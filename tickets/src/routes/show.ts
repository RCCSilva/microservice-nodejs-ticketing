import {
  NotFoundError,
  objectIdValidator,
  requireAuth,
  validateRequest
} from '@rccsilva-ticketing/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id',
  [
    param('id')
      .custom(objectIdValidator),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const ticketId = req.params.id

    const ticket = ticketId ? await Ticket.findById(ticketId) : null

    if (!ticket) {
      throw new NotFoundError()
    }

    res.status(200).send(ticket)
  })

export { router as showTicketRouter };

