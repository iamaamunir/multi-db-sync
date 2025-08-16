import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customerId: String,
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  total: Number,
  location: String,
  createdAt: { type: Date, default: Date.now() },
});

const orderModel = mongoose.model("Order", orderSchema);

export function dbConnection() {
  // mongoose.connect(process.env.MONGODB_URI);
  mongoose.connect("mongodb://mongo:27017/dual-sync-db");
  mongoose.connection.on("connected", () => {
    console.log("Connection to MongoDB is successful");
  });
  mongoose.connection.on("error", (err) => {
    console.log("Unable to Connect to MongoDB", err);
  });
}

export async function saveToMongoDB(order) {
  await orderModel.updateOne(
    { orderId: order.orderId },
    { $set: order, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );
}
