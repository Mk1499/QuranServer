import express from "express";
import Lecture from "../models/lecture.js";
import Teacher from "../models/teacher.js";
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
    .populate("teacher students student")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Can't list Lectures", error: err });
      } else {
        res.status(200).json(data);
      }
    });
});

lectureRouter.post("/join", (req, res) => {
  let { lectureId, studentId, studentName } = req.body;
  Lecture.findByIdAndUpdate(
    { _id: lectureId },
    { $addToSet: { students: studentId }, $set: { student: studentId } }
  )
    .populate("teacher", { webDeviceToken: 1, mobileDeviceToken: 1 })
    .exec((err, updatedDoc) => {
      if (err) {
        res.status(400).json({ message: "Can't list Lectures", error: err });
      } else {
        let teacher = updatedDoc.teacher;
        let noteBody = {
          title: "Join Request",
          body: `${
            studentName ? "Student " + studentName : "New Student "
          } Ask To Join ${updatedDoc.name} Lecture`,
          click_action: `lectures/${lectureId}`,
          recieverId: teacher._id,
          recieverType: "Teacher",
          date: Date.now(),
          route: "lectures",
          data: {
            url: "teacher/lectures",
            param: lectureId,
          },
        };
        // let token = teacher.webDeviceToken
        //   ? teacher.webDeviceToken
        //   : teacher.mobileDeviceToken;
        if (teacher.mobileDeviceToken) {
          console.log("Teacher has a mobile token");
          sendNotification(noteBody, teacher.mobileDeviceToken);
        }
        if (teacher.webDeviceToken) {
          console.log("Teacher has a web token");
          sendNotification(noteBody, teacher.webDeviceToken);
        }

        createNote(noteBody);
        res.status(200).json({
          message: "Student Joined to Lectrue Successfully",
          lectuerData: updatedDoc,
        });
      }
    });
});

lectureRouter.post("/leave", (req, res) => {
  let { teacherID, studentName, lectureName } = req.body;
  Teacher.findById(teacherID)
    .then((teacherData) => {
      let body = {
        title: `Student ${studentName} is leave lecture ${lectureName}`,
      };
      if (teacherData.webDeviceToken) {
        sendNotification(body, teacherData.webDeviceToken);
      }

      if (teacherData.mobileDeviceToken) {
        sendNotification(body, teacherData.mobileDeviceToken);
      }

      res.status(200);
    })
    .catch((err) => {
      console.log("Sending Leave Notification Err : ", err);
      res.send(400).json({
        message: "can't send leave message : " + err,
      });
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

lectureRouter.get("/live", (req, res) => {
  Lecture.find({ state: "live" })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res
        .status(400)
        .json({ message: "Error while finding live lectrues : ", err });
    });
});

lectureRouter.get("/:id", (req, res) => {
  Lecture.findOne({ _id: req.params.id })
    .populate({
      path: "students",
      model: "Student",
    })
    .populate("teacher student")
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
  Lecture.updateOne(
    { _id: lectureID },
    { $set: { state: "finished" } },
    (err) => {
      if (err) {
        res.status(400).json({ message: "cann't finish lecture" });
      } else {
        res.status(200).json({ message: "Lecture Finished" });
      }
    }
  );
});

export default lectureRouter;
