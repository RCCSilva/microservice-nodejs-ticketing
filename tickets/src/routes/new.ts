import { requireAuth, validateRequest } from '@rccsilva-ticketing/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';
import { ticketAttrValidator } from './util';
const router = express.Router();

router.post('/api/tickets',
  requireAuth,
  ticketAttrValidator,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    const ticket = await Ticket
      .build({ title, price, userId: req.currentUser!.id })
      .save()

    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })

    res.status(201).send(ticket)
  })

export { router as createTicketRouter }
