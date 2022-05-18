import { TicketCreatedEvent } from "@rccsilva-ticketing/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"

it('creates and saves a ticket', async () => {
  const { listener, fakeData, message } = setup()

  await listener.onMessage(fakeData, message)

  const ticket = await Ticket.findById(fakeData.id)

  expect(ticket!.title).toEqual(fakeData.title)
  expect(ticket!.price).toEqual(fakeData.price)
})

it('acks the message', async () => {
  const { listener, fakeData, message } = setup()

  await listener.onMessage(fakeData, message)

  expect(message.ack).toBeCalled()
})

const setup = () => {

  const listener = new TicketCreatedListener(natsWrapper.client)

  const fakeData: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: '9asd8as'
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
