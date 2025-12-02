import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
admin.initializeApp();

// --- MongoDB Connection --- //
const mongoURI = process.env.MONGO_URI || "";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI);
  }
};

// --- Mongoose Schemas --- //
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const gameSchema = new mongoose.Schema({
  title: String,
  genre: String,
  releaseDate: Date,
});

const Game = mongoose.model("Game", gameSchema);

const User = mongoose.model("User", userSchema);

// --- Express App Setup --- //
const app = express();
app.use(express.json());

// --- API Endpoints --- //
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/games", async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/games", async (req, res) => {
  try {
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// --- Firebase Function Export --- //
export const api = functions.https.onRequest(async (req, res) => {
  await connectToDatabase();
  app(req, res);
});

