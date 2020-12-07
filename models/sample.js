import mongoose from "mongoose";

const sampleSchema = mongoose.Schema({
//   _id: mongoose.Schema.Types.ObjectId,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  name: {
    type: String,
  },
  duration: {
    type: Number,
  },
  joz2: {
    type: String,
  },
  noOfAyat: {
    type: Number,
  },
  avatar:{
      type: String
  },
  url:{
      type: String, 
  }
});

export default mongoose.model("Sample", sampleSchema);
