import express from "express";
import Lecture from "../models/lecture.js";
import { sendNotification } from "./notify.js";

const lectureRouter = express.Router();

lectureRouter.post("/add", (req, res) => {
  let { name, teacher, time, description } = req.body;
  let newLecture = {
    name,
    teacher,
    time,
    description,
    created_at: Date.now(),
  };
  Lecture.create(newLecture, (err, lec) => {
    if (err) {
      res.status(400).json({ message: "Lecture Not Created", error: err });
    } else {
      res.status(200).json({ message: "Student Created", lec });
    }
  });
});

lectureRouter.get("/all", (req, res) => {
  Lecture.find({})
    .populate("teacher students")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Can't list Lectures", error: err });
      } else {
        res.status(200).json(data);
      }
    });
});

lectureRouter.post("/join", (req, res) => {
  let { lectureId, studentId } = req.body;
  Lecture.findByIdAndUpdate(
    { _id: lectureId },
    { $addToSet: { students: studentId } }
  )
    .populate("teacher", { webDeviceToken: 1, mobileDeviceToken: 1 })
    .exec((err, updatedDoc) => {
      if (err) {
        res.status(400).json({ message: "Can't list Lectures", error: err });
      } else {
        let teacher = updatedDoc.teacher;
        let noteBody = {
          title: "Join Request",
          body: `New Student Ask To Join ${updatedDoc.name} Lecture`,
          link: `lecture/${lectureId}`,
        };
        let token = teacher.webDeviceToken
          ? teacher.webDeviceToken
          : teacher.mobileDeviceToken;
        sendNotification(noteBody, token);
        res.status(200).json({
          message: "Student Joined to Lectrue Successfully",
          lectuerData: updatedDoc,
        });
      }
    });
});

export default lectureRouter;
