import { OrderCreatedEvent, OrderStatus } from "@rccsilva-ticketing/common"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"
import { natsWrapper } from "../../../nats-wrapper"
import { createMongoId } from "../../../test/helpers"
import { OrderCreatedListener } from "../order-created-listener"

it('creates an order', async () => {
  const { listener, fakeData, fakeMsg } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  const updatedTicket = await Order.findById(fakeData.id)

  expect(updatedTicket).toBeDefined()
})

it('acks a message', async () => {
  const { listener, fakeData, fakeMsg, } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  expect(fakeMsg.ack).toBeCalled()
})

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const fakeData =
    {
      id: createMongoId(),
      version: 10,
      userId: createMongoId(),
      status: OrderStatus.AwaitingPayment,
      ticket: { price: 10 }
    } as OrderCreatedEvent['data']
  const fakeMsg = { ack: jest.fn() } as unknown as Message

  return {
    listener,
    fakeData,
    fakeMsg
  }
}
