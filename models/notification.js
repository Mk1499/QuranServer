import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  click_action: {
    type: String,
    required: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
  },
  recieverType: {
    type: String,
    required: true,
  },
  recieverToken: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: false,
  },
  data: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Notification", notificationSchema);
