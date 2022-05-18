import { currentUser, NotAuthorizedError, NotFoundError, objectIdValidator, requireAuth } from '@rccsilva-ticketing/common'
import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import { Order } from '../models/order'

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  param('ticketId')
    .custom(objectIdValidator),
  requireAuth,
  async (
    req: Request, res: Response
  ) => {
    const order = await Order.findById(req.params.orderId)

    if (!order) {
      throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    res.status(200).send(order)
  }
)

export { router as showOrderRouter }
