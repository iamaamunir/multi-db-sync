import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString,
});
const connectionString = process.env.POSTGRES_DB_URL;

const orders =
  "CREATE TABLE IF NOT EXIST orders(id SERIAL PRIMARY KEY, userName VARCHAR(100) NOT NULL, product VARCHAR(100) NOT NULL, quantity INT NOT_NULL, totalPrice NUMERIC(10, 2) NOT NULL)";

export const createPgTable = async () => {
  await pool.query(orders);
  console.log("pg table created");
};

export const insertIntoTable = async (
  userName,
  product,
  quantity,
  totalPrice
) => {
  `INSERT INTO orders(userName, product, quantity, totalPrice) VALUES ($1, $2, $3, $4)`,
    [userName, product, quantity, totalPrice];
};

await pool.end();
