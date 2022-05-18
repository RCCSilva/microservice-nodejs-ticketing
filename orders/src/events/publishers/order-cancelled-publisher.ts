import { OrderCancelledEvent, Publisher, Subjects } from "@rccsilva-ticketing/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
