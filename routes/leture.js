import express from "express";
import Lecture from "../models/lecture.js";
import { createNote, sendNotification } from "./notify.js";
import mongoose from "mongoose";

const lectureRouter = express.Router();

lectureRouter.post("/add", (req, res) => {
  let {
    name,
    teacher,
    time,
    description,
    duration,
    coverURL,
    arName,
  } = req.body;
  let newLecture = {
    name,
    teacher,
    time,
    description,
    created_at: Date.now(),
    duration,
    coverURL,
    arName,
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
          click_action: `lectures/${lectureId}`,
          recieverId: teacher._id,
          recieverType: "Teacher",
          date: Date.now(),
          route: "lectures",
          data: lectureId,
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

lectureRouter.get("/teacher/:id", (req, res) => {
  Lecture.find({ teacher: req.params.id }).exec((err, data) => {
    if (err) {
      res.status(400).json({ message: "Can't list Lectures", error: err });
    } else {
      res.status(200).json(data);
    }
  });
});

lectureRouter.get("/student/:id", (req, res) => {
  Lecture.find({
    students: mongoose.Types.ObjectId(req.params.id),
  }).exec((err, data) => {
    if (err) {
      res.status(400).json({ message: "Can't list Lectures", error: err });
    }
    res.status(200).json(data);
  });
});

lectureRouter.post("/changeState", (req, res) => {
  let { lectureId, newState } = req.body;
  Lecture.updateOne(
    { _id: lectureId },
    {
      $set: {
        state: newState,
      },
    },
    (err, data) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Can't Update Lecture State", error: err });
      } else {
        res.status(200).json(data);
      }
    }
  );
});

lectureRouter.post("/changeAya", (req, res) => {
  let { lectureId, newAya } = req.body;
  Lecture.updateOne(
    { _id: lectureId },
    {
      $set: {
        aya: newAya,
      },
    },
    (err, data) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Can't Update Lecture Aya", error: err });
      } else {
        res.status(200).json(data);
      }
    }
  );
});

lectureRouter.get("/:id", (req, res) => {
  Lecture.findOne({ _id: req.params.id })
    .populate({
      path: "students",
      model: "Student",
    })
    .populate("teacher")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Can't get Lecture", error: err });
      } else {
        res.status(200).json(data);
      }
    });
});

lectureRouter.post("/finish", (req, res) => {
  let lectureID = req.body.id;
  Lecture.updateOne({ _id: lectureID }, { $set: { state: 'finished' } }, (err) => {
    if (err) {
      res.status(400).json({ message: "cann't finish lecture" });
    } else {
      res.status(200).json({ message: "Lecture Finished" });
    }
  })
})

export default lectureRouter;
