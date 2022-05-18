import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  objectIdValidator,
  requireAuth,
  validateRequest
} from '@rccsilva-ticketing/common';
import express, { Request, Response } from 'express';
import { param } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';
import { ticketAttrValidator } from './util';

const router = express.Router();

router.put('/api/tickets/:id',
  requireAuth,
  [
    param('id').custom(objectIdValidator)
  ],
  ticketAttrValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError()
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    if (req.currentUser!.id !== ticket.userId) {
      throw new NotAuthorizedError()
    }

    const { title, price } = req.body

    await ticket
      .set({ title, price })
      .save()

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      orderId: ticket.orderId,
    })

    res.status(200).send(ticket)
  })

export { router as updateTicketRouter };
