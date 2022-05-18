import { Publisher, Subjects, TicketCreatedEvent } from "@rccsilva-ticketing/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
