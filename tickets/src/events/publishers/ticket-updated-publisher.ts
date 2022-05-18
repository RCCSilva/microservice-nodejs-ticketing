import { Publisher, Subjects, TicketUpdatedEvent } from "@rccsilva-ticketing/common"

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
