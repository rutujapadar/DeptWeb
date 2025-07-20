import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: String,
  sgpa: Number
});

const resultSchema = new mongoose.Schema({
  semester: String,
  students: [studentSchema],
}, {
  timestamps: true
});

export default mongoose.model("AcademicResult", resultSchema, "academicresults");
