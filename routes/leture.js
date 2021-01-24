import express from "express";
import Lecture from "../models/lecture.js";
import { createNote, sendNotification } from "./notify.js";

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
          click_action: `lecture/${lectureId}`,
          recieverId: teacher._id,
          recieverType: "Teacher",
          date: Date.now(),
        };
        // let token = teacher.webDeviceToken
        //   ? teacher.webDeviceToken
        //   : teacher.mobileDeviceToken;
        if (teacher.mobileDeviceToken)
          sendNotification(noteBody, teacher.mobileDeviceToken);
        if (teacher.webDeviceToken)
          sendNotification(noteBody, teacher.webDeviceToken);

        createNote(noteBody);
        res.status(200).json({
          message: "Student Joined to Lectrue Successfully",
          lectuerData: updatedDoc,
        });
      }
    });
});

export default lectureRouter;
