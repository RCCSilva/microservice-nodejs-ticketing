import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { createTicket } from './utils'
import { Ticket } from '../../models/ticket'


it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signup())
    .send({
      title: 'Super Name!',
      price: '20'
    })

  expect(response.statusCode).toEqual(404)
})

it('returns a 400 if the id is an invalid ObjectId', async () => {
  const id = 'super-invalid-objectid!'

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signup())
    .send({
      title: 'Super Name!',
      price: '20'
    })

  expect(response.statusCode).toEqual(400)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Super Name!',
      price: '20'
    })

  expect(response.statusCode).toEqual(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const { ticket } = await createTicket({ title: 'test', price: 99 })

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', signup('another-user'))
    .send({
      title: 'Super Name!',
      price: '20'
    })

  expect(response.statusCode).toEqual(401)
})

it.each`
title          | price
${''}          | ${10}
${undefined}   | ${10}
${'title'}     | ${0}
${'title'}     | ${-1 * Number.MIN_VALUE}
`('returns a 400 if the user provides an invalid title or price (title: $title, price: $price)',
  async ({ title, price }
  ) => {
    const { ticket } = await createTicket({ title: 'test', price: 99 })

    const response = await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set('Cookie', signup())
      .send({
        title,
        price
      })

    expect(response.statusCode).toEqual(400)
  })

it('it updates the ticket if provided with valid title and price', async () => {
  const { ticket } = await createTicket({ title: 'test', price: 99 })

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', signup())
    .send({
      title: 'New Title',
      price: 999
    })

  expect(response.statusCode).toEqual(200)

  const responseGet = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send()

  expect(responseGet.statusCode).toEqual(200)
  expect(responseGet.body.title).toEqual('New Title')
  expect(responseGet.body.price).toEqual(999)
})


it('it rejects updates if the ticket is reserved', async () => {
  const { ticket } = await createTicket({ title: 'test', price: 99 })

  const ticketDb = await Ticket.findById(ticket.id)

  ticketDb!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
  await ticketDb!.save()

  const response = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', signup())
    .send({
      title: 'New Title',
      price: 999
    })

  expect(response.statusCode).toEqual(400)
})

