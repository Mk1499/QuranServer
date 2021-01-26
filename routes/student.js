import express from "express";
import Student from "../models/student.js";
import Teacher from "../models/teacher.js";
import Enroll from "../models/enroll.js";

import { studentActiveEnrollments, studentEnrollments } from "./enroll.js";

const studentRouter = express.Router();

studentRouter.post("/add", (req, res) => {
  console.log("Adding New Student : ", req.body);
  let { webToken, mobileToken } = req.body;
  let newStudent = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
    role: "student",
  };
  if (webToken) {
    newStudent["webDeviceToken"] = webToken;
  } else if (mobileToken) {
    newStudent["mobileDeviceToken"] = mobileToken;
  }

  Student.create(newStudent, (err, student) => {
    if (err) {
      res.status(400).json({ message: "Student Not Created", error: err });
    } else {
      res.status(200).json({ message: "Student Created", student });
    }
  });
});

studentRouter.get("/", (req, res) => {
  Student.find({}, (err, data) => {
    if (err) {
      res.status(400).json({ message: "Students Not Listed", error: err });
    } else {
      res.status(200).json({ students: data });
    }
  });
});

studentRouter.get("/:id", (req, res) => {
  Student.findOne({ _id: req.params.id }, async (err, data) => {
    if (err) {
      res.status(400).json({ message: "Students Not Listed", error: err });
    } else {
      console.log();
      let enrollData = (await studentActiveEnrollments(req, res, true)) || [];

      data["teachers"] = enrollData.map((en) => en.teacherID);
      res.status(200).json(data);
    }
  });
});

studentRouter.get("/:id/teachers", (req, res) => {
  Enroll.find(
    {
      studentID: req.params.id,
      active: true,
    },
    { teacherID: 1, _id: 0 }
  )
    .populate("teacherID")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Students Not Listed", error: err });
      } else {
        data = data.map((item) => item["teacherID"]);
        res.status(200).json(data);
      }
    });
});

studentRouter.post("/login", (req, res) => {
  let { email, password, mobileToken, webToken } = req.body;

  if (email && password) {
    let enhEmail = email.toLowerCase();

    Student.findOne({
      email: enhEmail,
      password,
    })
      .populate("teachers")
      .exec((err, data) => {
        if (err) {
          res.status(400).json({ message: "An Error Happened", error: err });
        } else if (data) {
          if (webToken) {
            console.log(data);
            Student.updateOne(
              { _id: data._id },
              {
                $set: {
                  webDeviceToken: webToken,
                },
              },
              (err) => {
                if (err) {
                  res
                    .status(404)
                    .json({ message: "Wrong Adding Device Token" });
                } else {
                  data["webDeviceToken"] = webToken;
                  res.status(200).json({ student: data });
                }
              }
            );
          }
          if (mobileToken) {
            Student.updateOne(
              { _id: data._id },
              {
                $set: {
                  mobileDeviceToken: mobileToken,
                },
              },
              (err) => {
                if (err) {
                  res
                    .status(404)
                    .json({ message: "Wrong Adding Device Token" });
                } else {
                  data["mobileDeviceToken"] = mobileToken;
                  res.status(200).json({ student: data });
                }
              }
            );
          }
        } else {
          res.status(404).json({ message: "Wrong email or password" });
        }
      });
  } else {
    res.status(400).json({
      message: "An Error Happened",
      error: "Email and Password Both Required",
    });
  }
});

studentRouter.post("/enroll", (req, res) => {
  let teacherID = req.body.teacher;
  let studentID = req.body.student;

  Student.updateOne(
    { _id: studentID },
    { $addToSet: { teachers: [teacherID] } },
    (err) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Can't assign Teacher to Student", error: err });
      } else {
        Teacher.updateOne(
          { _id: teacherID },
          { $addToSet: { students: [studentID] } },
          (err) => {
            if (err) {
              res.status(400).json({
                message: "Can't assign Student to Teacher ",
                error: err,
              });
            } else {
              res
                .status(200)
                .json({ message: "Student Enrolled Successfully" });
            }
          }
        );
      }
    }
  );
});

studentRouter.post("/unenroll", (req, res) => {
  let teacherID = req.body.teacher;
  let studentID = req.body.student;
  if (!teacherID) {
    res.status(400).json({
      message: "Incorrect Teacher ID ",
    });
  } else if (!studentID) {
    res.status(400).json({
      message: "Incorrect Student ID ",
    });
  } else
    Student.updateOne(
      { _id: studentID },
      { $pullAll: { teachers: [teacherID] } },
      (err) => {
        if (err) {
          res
            .status(400)
            .json({ message: "Can't Remove Teacher from Student", error: err });
        } else {
          Teacher.updateOne(
            { _id: teacherID },
            { $pullAll: { students: [studentID] } },
            (err) => {
              if (err) {
                res.status(400).json({
                  message: "Can't Remove Student from Teacher ",
                  error: err,
                });
              } else {
                res
                  .status(200)
                  .json({ message: "Student UnEnrolled Successfully" });
              }
            }
          );
        }
      }
    );
});

studentRouter.post("/logout", (req, res) => {
  let { studentId, platform } = req.body;
  if (platform === "web") {
    Student.findByIdAndUpdate(
      studentId,
      {
        $set: { webDeviceToken: null },
      },
      (err, data) => {
        if (err) {
          console.log("err : ", err);
        }
      }
    );
  } else if (platform === "mobile") {
    console.log("platform : ", platform);
    Student.findByIdAndUpdate(
      studentId,
      {
        $set: { mobileDeviceToken: null },
      },
      (err) => {
        if (err) {
          console.log("logout err : ", err);
        }
      }
    );
  }
  res.status(200).json({ message: "Logout Successfully" });
});

export default studentRouter;
