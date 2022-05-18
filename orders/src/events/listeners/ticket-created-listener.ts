import { Listener, Subjects, TicketCreatedEvent } from "@rccsilva-ticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  readonly queueGroupName = queueGroupName;

  async onMessage(data: { id: string; userId: string; title: string; price: number; }, msg: Message) {
    const { id, title, price } = data

    const ticket = Ticket.build({
      id,
      title,
      price,
    })

    await ticket.save()

    msg.ack()
  }
}
