// Booking routes: Only authenticated users can book a room
import express from "express";
import jwt from "jsonwebtoken";
import Room from "../models/Room.js";

const router = express.Router();

// Middleware to check authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Book a room (requires authentication)
router.post("/", authenticateToken, async (req, res) => {
  const { roomId, startDate, endDate } = req.body;
  // You can expand this to save bookings in a Booking model
  if (!roomId || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing booking details" });
  }
  // Example: Just check if room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  // Here you would save the booking to the database
  res.status(201).json({ message: "Room booked! (not actually saved, demo only)", roomId, startDate, endDate });
});

export default router;
