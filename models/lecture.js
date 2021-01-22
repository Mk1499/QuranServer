import mongoose from "mongoose";

const lectureSchema = mongoose.Schema({
  students: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Student",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Lecture", lectureSchema);
