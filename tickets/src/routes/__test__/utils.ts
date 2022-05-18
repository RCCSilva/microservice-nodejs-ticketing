import request from 'supertest'
import { app } from '../../app'
import { TicketDoc } from '../../models/ticket'

export const createTicket = async ({ title, price }: { title: any, price: any }) => {
  const token = global.signup()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', token)
    .send({
      title,
      price,
    })
    .expect(201)

  const ticket = response.body as TicketDoc

  return {
    token,
    ticket,
  }
}
