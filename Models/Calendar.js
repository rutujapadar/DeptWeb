
import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema({
  academicYear: String,
  title: String,         
    pdfFile: {
    filename: String,
    path: String
  }
});

export default mongoose.model("Calendar", CalendarSchema, "academiccalendars");

