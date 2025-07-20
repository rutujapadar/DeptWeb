import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  day: String,
  time: String,
  venue: String,
  isActive: Boolean
});

export default mongoose.model("Event", EventSchema, "events");
