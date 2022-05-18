import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'


it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
  
  expect(response.statusCode).toEqual(404)
})

it('returns 400 when given invalid ObjectId', async () => {
  mongoose.Types.ObjectId.isValid('asd')

  const response = await request(app)
  .get(`/api/tickets/super-invalid-object-id123`)
  .send()

expect(response.statusCode).toEqual(400)
})

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert'
  const price = 20

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', signup())
    .send({
      title,
      price,
    })
    .expect(201)

  const responseGet = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(responseGet.statusCode).toEqual(200)
})
