import { OrderStatus } from "@rccsilva-ticketing/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
  id: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

export interface OrderDoc extends mongoose.Document {
  id: string
  version: number
  userId: string
  price: number
  status: OrderStatus
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      ret._id = undefined
    }
  }
});

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) =>
  new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  })

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export { Order }
