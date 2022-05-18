import { OrderCreatedEvent, Publisher, Subjects } from "@rccsilva-ticketing/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
