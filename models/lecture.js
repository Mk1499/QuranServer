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
  arName: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  duaration: {
    type:  Number,
    default: 60,
  },
  coverURL: {
    type: String,
  },
  time: {
    type: Date,
    default: new Date(),
  },
  state: {
    type: String,
  },
});

export default mongoose.model("Lecture", lectureSchema);
