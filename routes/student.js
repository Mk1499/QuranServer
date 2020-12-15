import express from "express";
import Student from "../models/student.js";
import Teacher from "../models/teacher.js";

const studentRouter = express.Router();

studentRouter.post("/add", (req, res) => {
  console.log("Adding New Student : ", req.body);

  Student.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
      role: "student",
    },

    (err, student) => {
      if (err) {
        res.status(400).json({ message: "Student Not Created", error: err });
      } else {
        res.status(200).json({ message: "Student Created", student });
      }
    }
  );
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
  Student.find({ _id: req.params.id })
    .populate("teachers")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Students Not Listed", error: err });
      } else {
        res.status(200).json( data[0] );
      }
    });
});

studentRouter.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  Student.findOne({
    email,
    password,
  })
    .populate("teachers")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "An Error Happened", error: err });
      } else if (data) {
        res.status(200).json({ student: data });
      } else {
        res.status(404).json({ message: "Wrong email or password" });
      }
    });
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

export default studentRouter;
