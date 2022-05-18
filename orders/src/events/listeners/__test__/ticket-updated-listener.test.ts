import { TicketUpdatedEvent } from "@rccsilva-ticketing/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"

it('finds, updates and saves a ticket', async () => {

  const { listener, fakeData, message } = await setup()

  await listener.onMessage(fakeData, message)

  const ticket = await Ticket.findById(fakeData.id)

  expect(ticket!.title).toEqual(fakeData.title)
  expect(ticket!.price).toEqual(fakeData.price)
  expect(ticket!.version).toEqual(fakeData.version)
})

it('acks the message', async () => {
  const { listener, fakeData, message } = await setup()

  await listener.onMessage(fakeData, message)

  expect(message.ack).toBeCalled()
})

it('throws an error when the ticket is sent out of order', async () => {
  const { listener, fakeData, message } = await setup()

  fakeData.version += 1

  await expect(() => listener.onMessage(fakeData, message)).rejects.toThrowError()
  expect(message.ack).not.toBeCalled()
})

const setup = async () => {

  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 11
  }).save()

  const fakeData: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new-concert',
    price: 999,
    userId: 'asd8a9sd8',
    orderId: undefined
  }

  const message = {
    ack: jest.fn()
  } as unknown as Message

  return {
    listener,
    fakeData,
    message,
  }
}
