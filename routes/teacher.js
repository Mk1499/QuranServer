import express from "express";
import Teacher from "../models/teacher.js";
import { studentActiveEnrollments, teacherActiveEnrollments } from "./enroll.js";

const teacherRouter = express.Router();

teacherRouter.post("/add", (req, res) => {
  console.log("Adding New teacher : ", req.body);

  Teacher.create(
    {
      name: req.body.name,
      arName: req.body.arName,
      email: req.body.email,
      password: req.body.password,
      avatar: req.body.avatar,
      price: req.body.price,
      role: "teacher",
    },
    (err, teacher) => {
      if (err) {
        res.status(400).json({ message: "teacher Not Created", error: err });
      } else {
        res.status(200).json({ message: "teacher Created", teacher });
      }
    }
  );
});

teacherRouter.get("/", (req, res) => {
  Teacher.find({}, (err, data) => {
    if (err) {
      res.status(400).json({ message: "teachers cannot listed", error: err });
    } else {
      res.status(200).json({ teachers: data });
    }
  });
});

teacherRouter.get("/:id", (req, res) => {
  Teacher.findOne({ _id: req.params.id })
    .populate("samples")
    .exec(async (err, data) => {
      if (err) {
        res.status(400).json({ message: "teacher cannot found", error: err });
      } else {
        let enrollData = await teacherActiveEnrollments(req,res,true) || [];  
        data['students'] = enrollData.map(en => en.studentID);
        res.status(200).json(data);
      }
    });
});

export default teacherRouter;
