import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { createMongoId } from '../../test/helpers'

const buildTicket = async () => {
  return Ticket.build({
    id: createMongoId(),
    title: 'concert',
    price: 20,
  }).save()
}

const buildOrder = async (token: string, ticketId: number) => {
  return request(app)
    .post('/api/orders')
    .set('Cookie', token)
    .send({ ticketId })
    .expect(201)
}

it('returns a list of orders', async () => {
  // Arrange
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  const user1 = global.signup()
  const user2 = global.signup()

  await buildOrder(user1, ticket1.id)
  await buildOrder(user1, ticket2.id)
  await buildOrder(user2, ticket3.id)

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200)

  expect(response.body).toHaveLength(1)
})
