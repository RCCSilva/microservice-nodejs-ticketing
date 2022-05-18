import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus, } from "@rccsilva-ticketing/common"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { createMongoId } from "../../../test/helpers"
import { OrderCancelledListener } from "../order-cancelled-listener"

it('unlocks a ticket when an order created event is consumed', async () => {
  const { listener, fakeData, fakeMsg, } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  const order = await Order.findById(fakeData.id)

  expect(order!.status).toEqual(OrderStatus.Cancelled)
})

it('acks a message', async () => {
  const { listener, fakeData, fakeMsg } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  expect(fakeMsg.ack).toBeCalled()
})



const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const order = Order.build({
    id: createMongoId(),
    version: 1,
    userId: createMongoId(),
    price: 10,
    status: OrderStatus.AwaitingPayment,
  })

  await order.save()

  const fakeData =
    {
      id: order.id,
    } as unknown as OrderCreatedEvent['data']

  const fakeMsg = { ack: jest.fn() } as unknown as Message

  return {
    listener,
    fakeData,
    fakeMsg
  }
}
