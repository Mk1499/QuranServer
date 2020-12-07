import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Review", reviewSchema);
