import mongoose, { Schema, Document } from "mongoose";

// Định nghĩa các trạng thái có thể có của đơn hàng
export type OrderStatus = 'created' | 'in_progress' | 'delivered' | 'completed' | 'disputed' | 'cancelled';

export interface IOrder extends Document {
  gigId: mongoose.Types.ObjectId;
  gigTitle: string;
  gigImage: string;
  buyerId: string;
  sellerId: string;
  price: number;
  status: OrderStatus;
  deliveryFile?: string;
  deliveryNote?: string;
  // ... các trường khác
}

const OrderSchema = new Schema(
  {
    // Thông tin cơ bản
    gigId: { type: Schema.Types.ObjectId, ref: 'Gig', required: true },
    gigTitle: { type: String, required: true },
    gigImage: { type: String }, 
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    price: { type: Number, required: true },
    
    // TRẠNG THÁI (State Machine)
    // created -> in_progress <-> delivered -> completed
    //              ^ (revision) |
    //                           v (dispute) -> disputed -> cancelled (refund)
    status: { 
      type: String, 
      enum: ["created", "in_progress", "delivered", "completed", "disputed", "cancelled"],
      default: "created" 
    },

    // Giao hàng & Tự động
    deliveryFile: { type: String }, 
    deliveryNote: { type: String }, 
    autoCompleteAt: { type: Date }, // Mốc thời gian 72h

    // Yêu cầu sửa lại (Revision)
    revisionsCount: { type: Number, default: 0 },

    // Tranh chấp & Hoàn tiền
    disputeReason: { type: String },
    refundReason: { type: String }, // Lý do Seller hủy đơn hoàn tiền

    paidAt: { type: Date },      
    deliveredAt: { type: Date }, 
    completedAt: { type: Date }, 
    cancelledAt: { type: Date }
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;