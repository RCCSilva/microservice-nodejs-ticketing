import { OrderCreatedEvent, Subjects } from "@rccsilva-ticketing/common"
import { json } from "express"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { createMongoId } from "../../../test/helpers"
import { OrderCreatedListener } from "../order-created-listener"

it('locks a ticket when an order created event is consumed', async () => {
  const { listener, fakeData, fakeMsg, ticket } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toEqual(fakeData.id)
})

it('acks a message', async () => {
  const { listener, fakeData, fakeMsg, } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  expect(fakeMsg.ack).toBeCalled()
})

it('publishes a ticket updated event when the order is created', async () => {
  const { listener, fakeData, fakeMsg, ticket } = await setup()

  await listener.onMessage(fakeData, fakeMsg);

  const updatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(updatedData.id).toEqual(ticket.id)
})

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = await Ticket.build({ title: 'concert', price: 10, userId: 'a89sd7' }).save()
  const fakeData =
    { id: createMongoId(), ticket: { id: ticket.id } } as unknown as OrderCreatedEvent['data']
  const fakeMsg = { ack: jest.fn() } as unknown as Message

  return {
    listener,
    ticket,
    fakeData,
    fakeMsg
  }
}
