import { OrderCancelledEvent, } from "@rccsilva-ticketing/common"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { createMongoId } from "../../../test/helpers"
import { OrderCancelledListener } from "../order-cancelled-listener"

it('unlocks a ticket when an order created event is consumed', async () => {
  const { listener, fakeData, fakeMsg, ticket } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).toBeUndefined()
})

it('acks a message', async () => {
  const { listener, fakeData, fakeMsg } = await setup()

  await listener.onMessage(fakeData, fakeMsg)

  expect(fakeMsg.ack).toBeCalled()
})

it('publishes a ticket updated event when the order is cancelled', async () => {
  const { listener, fakeData, fakeMsg, ticket } = await setup()

  await listener.onMessage(fakeData, fakeMsg);

  const updatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  expect(updatedData.id).toEqual(ticket.id)
})


const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const ticket = Ticket.build({ title: 'concert', price: 10, userId: 'a89sd7' })
  ticket.set({ orderId: createMongoId() })
  await ticket.save()

  const fakeData =
    { id: createMongoId(), ticket: { id: ticket.id } } as unknown as OrderCancelledEvent['data']
  const fakeMsg = { ack: jest.fn() } as unknown as Message

  return {
    listener,
    ticket,
    fakeData,
    fakeMsg
  }
}
