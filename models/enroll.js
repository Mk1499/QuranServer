import mongoose from "mongoose";

const enrollSchema = mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  studentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  teacherID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  month: {
    type: mongoose.Schema.Types.Number,
    default: new Date().getMonth(),
  },
  dateTime: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Enroll", enrollSchema);
