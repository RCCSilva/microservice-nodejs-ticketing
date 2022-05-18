import { ExpirationCompleteEvent, OrderStatus } from "@rccsilva-ticketing/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"

jest.mock('../../../nats-wrapper')

it('updates order status to cancelled', async () => {
  const { listener, fakeData, message, order } = await setup()

  await listener.onMessage(fakeData, message)

  const orderDb = await Order.findById(order.id).populate('ticket')

  expect(orderDb!.status).toEqual(OrderStatus.Cancelled)
  expect(orderDb!.ticket).not.toBeNull()
})

it('acks the message', async () => {
  const { listener, fakeData, message } = await setup()

  await listener.onMessage(fakeData, message)

  expect(message.ack).toBeCalled()
})

it('publishes an OrderCancelled', async () => {
  const { listener, fakeData, message, order } = await setup()

  await listener.onMessage(fakeData, message)

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(eventData.id).toEqual(order.id)
})


const setup = async () => {

  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  })

  await ticket.save()

  const order = Order.build({
    status: OrderStatus.Created,
    userId: '9asd',
    expiresAt: new Date(),
    ticket,
  })

  await order.save()

  const fakeData: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  }

  const message = {
    ack: jest.fn()
  } as unknown as Message

  return {
    listener,
    fakeData,
    message,
    order,
    ticket
  }
}
