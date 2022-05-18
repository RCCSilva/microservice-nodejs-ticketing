import { NotAuthorizedError, NotFoundError, objectIdValidator, OrderStatus, requireAuth } from '@rccsilva-ticketing/common'
import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { Order } from '../models/order'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete('/api/orders/:orderId',
  param('ticketId')
    .custom(objectIdValidator),
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    await order.set({
      status: OrderStatus.Cancelled
    }).save()

    await new OrderCancelledPublisher(natsWrapper.client)
      .publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id
        }
      })

    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
