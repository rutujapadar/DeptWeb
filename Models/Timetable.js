import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
  year: String,
  title: String,
  pdfFile: {
    filename: String,
    path: String,
    mimetype: String
  },
});

export default mongoose.model("Timetable", TimetableSchema, "timetables");
