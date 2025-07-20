
import mongoose from "mongoose";

const CurriculumSchema = new mongoose.Schema({
  year: String,
  description: String,         
    pdfFile: {
    filename: String,
    path: String
  }
});

export default mongoose.model("Curriculum", CurriculumSchema, "curriculums");

