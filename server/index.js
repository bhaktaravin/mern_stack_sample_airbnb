import { config } from "dotenv";
config( {path: "./.env"} );

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/", (req, res) => {
    console.log("Welcome to the Sample Airbnb API");
    res.send("Welcome to the Sample Airbnb API");
})


console.log(process.env.DATABASE_URL);
// Connect to MongoDB and start the server
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 8080, "0.0.0.0", () => {
      console.log(`Server is running on http://0.0.0.0:${process.env.PORT || 8080}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  // Listening on port, 0.0.0.0:8080 for access from outside
app.listen(process.env.PORT || 8080 , '  f0.0.0.0', () => {
    console.log(`Server is running on http://${localhost}:${PORT}`);
});