import { OrderStatus } from "@rccsilva-ticketing/common"
import supertest from "supertest"
import { app } from "../../app"
import { PaymentCreatedPublisher } from "../../events/publishers/payment-created-publisher"
import { Order } from "../../models/order"
import { Payment } from "../../models/payments"
import { natsWrapper } from "../../nats-wrapper"
import { createMongoId } from "../../test/helpers"

jest.mock('../../stripe')

it('returns a 404 when purchasing an order that does not exist', async () => {
  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asd',
      orderId: createMongoId(),
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = await Order.build({
    id: createMongoId(),
    userId: createMongoId(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save()

  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signup())
    .send({
      token: 'asd',
      orderId: order.id,
    })
    .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = createMongoId()

  const order = await Order.build({
    id: createMongoId(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  }).save()

  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'asd',
      orderId: order.id,
    })
    .expect(400)
})

it('returns a 204', async () => {
  const userId = createMongoId()

  const order = await Order.build({
    id: createMongoId(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save()

  await supertest(app)
    .post('/api/payments')
    .set('Cookie', global.signup(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const payment = await Payment.findOne({ orderId: order.id })

  expect(payment).not.toBeNull()
})
