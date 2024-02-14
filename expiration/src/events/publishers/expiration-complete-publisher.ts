import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@ousstickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
