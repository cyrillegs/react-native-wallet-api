import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import transactionRoutes from "./routes/transactionsRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// middleware
app.use(rateLimiter);
app.use(express.json());

// api routes
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5001;

console.log("my port: ", PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});
