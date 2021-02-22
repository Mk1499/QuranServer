import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

import studentRouter from "./routes/student.js";
import teacherRouter from "./routes/teacher.js";
import reviewRouter from "./routes/review.js";
import sampleRouter from "./routes/sample.js";
import adminRouter from "./routes/admin.js";
import enrollRouter from "./routes/enroll.js";
import notifyRouter from "./routes/notify.js";
import lectureRouter from "./routes/leture.js";

import {socketHandler} from './socket-handler.js';

const app = express();
const server = http.Server(app);
export const io = new Server(server, {
  cors: {
    origin: [
      "https://localhost:4200",
      "http://localhost:4200",
      "http://localhost:8100",
      "https://quranak-4a78a.web.app",
      "https://quranmk.herokuapp.com",
      "https://192.168.1.4:4200",
      "http://192.168.1.10:8100",
      "https://192.168.1.10:4200",
      "http://localhost",
      "quranmkserver.herokuapp.com",
      "*",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let mongoDB =
  "mongodb+srv://MK:123456789mK14@cluster0-c4uwc.gcp.mongodb.net/Quran?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true }).catch((err) => {
  throw err;
});

mongoose.connection.once("open", () => {
  console.log("connected to Database");
});

// app.use("*",(req,res,next)=>{
//   console.log("REQ : ",req.rawHeaders);
//   next();
// })
app.get("/", (req, res) => {
  res.send("Welcome in Quran Dev Server");
});
app.use(bodyParser.json());
app.use(cors());

io.on("connection", (socket) => {
  console.log("Socket Connected!!!");

  socketHandler(socket);
});

app.use("/student", studentRouter);
app.use("/teacher", teacherRouter);
app.use("/review", reviewRouter);
app.use("/sample", sampleRouter);
app.use("/admin", adminRouter);
app.use("/enroll", enrollRouter);
app.use("/notify", notifyRouter);
app.use("/lecture", lectureRouter);

let port = process.env.PORT || 3005;

server.listen(port, () => {
  console.log("Server has started on port no : ", port);
});
