import { Listener, NotFoundError, OrderCancelledEvent, OrderStatus, Subjects } from "@rccsilva-ticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  readonly queueGroupName = queueGroupName

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { id } = data

    const order = await Order.findById(id)

    if (!order) {
      throw new NotFoundError()
    }

    order.set({ status: OrderStatus.Cancelled })

    await order.save()

    msg.ack()
  }
}
