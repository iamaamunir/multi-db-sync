import express from "express";
import dotenv from "dotenv";
import { createTable, insertIntoTable } from "./config/postgres.config.js";
import { dbConnection, saveToMongoDB } from "./config/mongodb.config.js";
dotenv.config();

const app = express();
app.use(express.json());
createTable();
dbConnection();

app.post("/orders", async (req, res) => {
  console.log('13')
  const { orderId, customerId, items, totalPrice, location } = req.body;

  const pgPayload = { orderId, customerId, items, totalPrice };
  const mongoPayload = { orderId, customerId, items, totalPrice, location };
  try {
    await insertIntoTable(pgPayload);
    await saveToMongoDB(mongoPayload);
     return res
       .status(201)
       .json({ message: "Order stored in Postgres and Mongo" });
  } catch (error) {
    console.log(error)
    console.error("Dual-write error:", error.message);
    return res.status(500).json({ error: "Failed to store order" });
  }
});


export default app;
