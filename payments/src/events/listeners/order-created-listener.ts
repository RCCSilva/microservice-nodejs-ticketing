import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@rccsilva-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, version, userId, status, ticket: { price } } = data

    const order = Order.build({ id, version, userId, price, status })

    await order.save()

    msg.ack()
  }
}
