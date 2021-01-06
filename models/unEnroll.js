import mongoose from "mongoose";

const unEnrollSchema = mongoose.Schema({
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
  dateTime: {
    type: mongoose.Schema.Types.Date,
    default: new Date(),
  },
});

export default mongoose.model("unEnroll", unEnrollSchema);
