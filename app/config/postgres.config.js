import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const connectionString = "postgresql://postgres:postgres@postgres:5432/dual_sync_db?sslmode=disable"

const pool = new Pool({
  connectionString,
});


const order =
  "CREATE TABLE IF NOT EXISTS orders (orderId VARCHAR(50) NOT NULL UNIQUE, customerId VARCHAR(50) NOT NULL,totalPrice NUMERIC(10, 2)NOT NULL,  createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW())";

const orderItems =
  "CREATE TABLE IF NOT EXISTS order_items (id SERIAL PRIMARY KEY, orderId VARCHAR(50) NOT NULL REFERENCES orders(orderId), productId VARCHAR(50) NOT NULL,  quantity INT NOT NULL CHECK (quantity > 0))";

export const createTable = async () => {
  await pool.query(order);
  await pool.query(orderItems);
  console.log("pg table created");
};

export const insertIntoTable = async ({
  orderId,
  customerId,
  items,
  totalPrice,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO orders(orderId, customerId, totalPrice) VALUES ($1, $2, $3)`,
      [orderId, customerId, totalPrice]
    );
    for (const it of items) {
      await client.query(
        `INSERT INTO order_items (orderId, productId, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [orderId, it.productId, it.quantity]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// EventManager: Handles subscribing, unsubscribing, and notifying listeners
class EventManager {
  constructor() {
    this.listeners = {}; // key: eventType, value: array of listeners
  }

  subscribe(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(listener);
  }

  unsubscribe(eventType, listener) {
    if (!this.listeners[eventType]) return;
    this.listeners[eventType] = this.listeners[eventType].filter(
      (l) => l !== listener
    );
  }

  notify(eventType, data) {
    if (!this.listeners[eventType]) return;
    this.listeners[eventType].forEach((listener) => {
      listener.update(data);
    });
  }
}

