import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string
  stripeId: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

export interface PaymentDoc extends mongoose.Document {
  id: string
  orderId: string
  stripeId: string
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      ret._id = undefined
    }
  }
});


paymentSchema.statics.build = (attrs: PaymentAttrs) =>
  new Payment({
    orderId: attrs.orderId,
    stripeId: attrs.stripeId,
  })

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema)

export { Payment }
