import { OrderStatus } from '@rccsilva-ticketing/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'
import { createMongoId } from '../../test/helpers'

it('returns an error if the ticket does no exists', async () => {
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId })
    .expect(404)

})

it('returns an error if the ticket is already reserved', async () => {
  // Arrange
  const ticket = await Ticket.build({
    id: createMongoId(),
    title: 'concert',
    price: 20,
  }).save()

  await Order.build({
    ticket,
    userId: '123asdasd',
    status: OrderStatus.Created,
    expiresAt: new Date()
  }).save()

  // Act
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  // Arrange
  const ticket = await Ticket.build({
    id: createMongoId(),
    title: 'concert',
    price: 20,
  }).save()

  // Act
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)
})

it('emits an order created event', async () => {
    // Arrange
    const ticket = await Ticket.build({
      id: createMongoId(),
      title: 'concert',
      price: 20,
    }).save()
  
    // Act
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signup())
      .send({ ticketId: ticket.id })
      .expect(201)

    expect(natsWrapper.client.publish).toBeCalled()
})
