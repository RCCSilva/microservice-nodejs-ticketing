import { OrderStatus } from '@rccsilva-ticketing/common'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'
import { createMongoId } from '../../test/helpers'

it('fetches the order', async () => {
  // Arrange
  const user = global.signup()

  const ticket = await Ticket.build({
    id: createMongoId(),
    title: 'concert',
    price: 20,
  }).save()

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const orderId = response.body.id

  // Act
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(204)


  const orderDb = await Order.findById(orderId)
  expect(orderDb!.status).toEqual(OrderStatus.Cancelled)
})

it('returns an error if the user attempts to fetch an order she does not own', async () => {
  // Arrange
  const user = global.signup()

  const ticket = await Ticket.build({
    id: createMongoId(),
    title: 'concert',
    price: 20,
  }).save()

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signup())
    .send({ ticketId: ticket.id })
    .expect(201)

  // Act
  await request(app)
    .delete(`/api/orders/${response.body.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(401)
})

it('emits a order cancelled event', async () => {
  // Arrange
  const user = global.signup()

  const ticket = await Ticket.build({
    id: createMongoId(),
    title: 'concert',
    price: 20,
  }).save()

  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const orderId = response.body.id

  // Act
  await request(app)
    .delete(`/api/orders/${orderId}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(204)

  // Assert
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
