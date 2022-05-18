import { ExpirationCompleteEvent, Publisher, Subjects } from "@rccsilva-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
