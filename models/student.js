import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  // _id : mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
    default:
      "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png",
  },
  role: {
    type: String,
    default: "Student",
  },
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  webDeviceToken: {
    type: String,
    default: null,
  },
  mobileDeviceToken: {
    type: String,
    default: null,
  },
});

export default mongoose.model("Student", studentSchema);
