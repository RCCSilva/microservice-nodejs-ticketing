import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'


it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.statusCode).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.statusCode).toEqual(401)
})

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({})

  expect(response.statusCode).not.toEqual(401)
})

it.each`
title
${''}
${undefined}
`('returns an error if an invalid title is provided ($title)', async ({ title }) => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({
      title,
      price: 10,
    })

  expect(response.statusCode).toEqual(400)
})

it.each`
price
${''}
${undefined}
${'text'}
${-0.01}
${-0.0000000000001}
${-1 * Number.MIN_VALUE}
`('returns an error if an invalid price is provided (price: $price)', async ({ price }) => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({
      title: 'Super Title!',
      price,
    })

  expect(response.statusCode).toEqual(400)
})

it('returns a ticket with valid inputs', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({
      title: 'another test',
      price: 20,
    })

  expect(response.statusCode).toEqual(201)

  expect(response.body.id).not.toBeNull()
  const ticketDb = await Ticket.findById(response.body.id)

  expect(ticketDb).not.toBeNull()
})

it('publishes an event', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({
      title: 'another test',
      price: 20,
    })

  expect(response.statusCode).toEqual(201)

  expect(response.body.id).not.toBeNull()
  const ticketDb = await Ticket.findById(response.body.id)

  expect(ticketDb).not.toBeNull()

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
