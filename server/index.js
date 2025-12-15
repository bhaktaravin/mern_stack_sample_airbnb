
import express from "express";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import connectDB from "./config/conn.js";
import cors from 'cors';
import router from "./routes/route.js";

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


connectDB();
console.log("Connecting to MongoDB...", process.env.MONGO_URI);


app.use('/api', router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
