import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
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

  // Act
  await request(app)
    .get(`/api/orders/${response.body.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(200)
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
    .get(`/api/orders/${response.body.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(401)
})
