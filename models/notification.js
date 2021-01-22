import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  body:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },  
  link:{
    type: String,
    required: true
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
    required: true,
  },
  date:{
      type:String,
      required:true
  },


});

export default mongoose.model("Notification", notificationSchema);
