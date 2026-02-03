import { createClient } from 'redis';
import { getEmbedding } from '../openaiEmbed.js';
import express from 'express';
import Room from "../models/Room.js";
import redisClient from "../redisClient.js";

const router = express.Router();

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://default:' + process.env.REDIS_API_KEY + '@localhost:6379',
});
await redis.connect();

// Helper: Index a room in Redis LangCache using OpenAI SDK
async function indexRoom(room) {
  const text = `${room.name} ${room.description}`;
  const vector = await getEmbedding(text);
  await redis.hSet('room_vectors', room._id.toString(), JSON.stringify({ vector, roomId: room._id }));
}

// Index all rooms (run once or on demand)
router.post('/index-all', async (req, res) => {
  const rooms = await Room.find();
  for (const room of rooms) {
    await indexRoom(room);
  }
  res.json({ message: 'All rooms indexed for semantic search.' });
});

// Enhanced semantic search endpoint: returns top N results with scores
// Semantic search endpoint with filtering
router.post('/semantic-search', async (req, res) => {
  const { query, count = 5, property_type, room_type, min_price, max_price, amenities } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const queryVector = await getEmbedding(query);
  const allVectors = await redis.hGetAll('room_vectors');
  // Calculate similarity scores for all rooms
  const scoredRooms = [];
  for (const [roomId, data] of Object.entries(allVectors)) {
    const { vector } = JSON.parse(data);
    // Simple dot product for similarity
    const score = vector.reduce((sum, v, i) => sum + v * queryVector[i], 0);
    scoredRooms.push({ roomId, score });
  }
  // Sort by score descending
  scoredRooms.sort((a, b) => b.score - a.score);
  // Fetch room details and apply filters
  let rooms = await Promise.all(scoredRooms.map(async ({ roomId, score }) => {
    const room = await Room.findById(roomId);
    if (!room) return null;
    // Filtering logic
    if (property_type && room.property_type !== property_type) return null;
    if (room_type && room.room_type !== room_type) return null;
    if (min_price && Number(room.price) < Number(min_price)) return null;
    if (max_price && Number(room.price) > Number(max_price)) return null;
    if (amenities && Array.isArray(amenities)) {
      const hasAllAmenities = amenities.every(a => room.amenities.includes(a));
      if (!hasAllAmenities) return null;
    }
    return { room, score };
  }));
  // Filter out any nulls (missing or filtered rooms) and take top N
  rooms = rooms.filter(Boolean).slice(0, count);
  res.json({
    results: rooms,
    query,
    count: rooms.length,
    enhancement: 'Sorted by semantic similarity, returns top N results with scores and supports filtering.'
  });
});

// Create a new room (accepts full Room schema)
router.post("/", async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ error: "Error creating room", details: error.message });
  }
});

// Get all rooms with pagination and Redis caching
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const cacheKey = `rooms:page:${page}:limit:${limit}`;
  try {
    // Try to get from Redis cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    // Not cached, fetch from DB
    const rooms = await Room.find().skip(skip).limit(limit);
    const total = await Room.countDocuments();
    const result = {
      rooms,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    };
    // Cache the result for 60 seconds
    await redisClient.setEx(cacheKey, 60, JSON.stringify(result));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching rooms" });
  }
});

// Get a specific room by ID
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: "Error fetching room" });
  }
});

// Update a room by ID (accepts full Room schema)
router.put("/:id", async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ error: "Error updating room", details: error.message });
  }
});

// Delete a room by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting room" });
  }
});

export default router;