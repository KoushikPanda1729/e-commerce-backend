import mongoose from "mongoose";


const orderSchema = new mongoose.Schema({
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    items: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Product', 
          required: true 
        },
        quantity: { 
          type: Number, 
          required: true 
        },
        price: { 
          type: Number, 
          required: true 
        }
      }
    ],
    totalAmount: { 
      type: Number, 
      required: true 
    },
    shippingAddress: {
      street: { 
        type: String, 
        required: true 
      },
      city: { 
        type: String, 
        required: true 
      },
      state: { 
        type: String, 
        required: true 
      },
      postalCode: { 
        type: String, 
        required: true 
      },
      country: { 
        type: String, 
        required: true 
      }
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
      default: 'Pending' 
    },
    orderDate: { 
      type: Date, 
      default: Date.now 
    }
  });
  

export const Order = mongoose.model("Order", orderSchema);
