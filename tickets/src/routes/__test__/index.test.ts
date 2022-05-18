import request from 'supertest'
import { app } from '../../app'
import { createTicket } from './utils'


it('can fetch a list of tickets', async () => {
  createTicket({ title: 'concert1', price: 20 })
  createTicket({ title: 'concert2', price: 30 })
  createTicket({ title: 'concert3', price: 40 })

  const response = await request(app)
    .get('/api/tickets')
    .send()

  expect(response.statusCode).toEqual(200)

})

