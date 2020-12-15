import express from "express";
import Teacher from "../models/teacher.js";

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
  Teacher.find({ _id: req.params.id })
    .populate("samples")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "teacher cannot found", error: err });
      } else {
        res.status(200).json(data[0]);
      }
    });
});

export default teacherRouter;
