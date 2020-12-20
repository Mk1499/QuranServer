import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
  // _id : mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
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
    default:"Admin"
  },
});

export default mongoose.model("Admin", adminSchema);
