import { PaymentCreatedEvent, Publisher, Subjects } from "@rccsilva-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated; 
}