import express from "express";
import Sample from "../models/sample.js";
import Teacher from "../models/teacher.js";

const sampleRouter = express.Router();

const addSampleToTeacher = async (sample, res) => {
  console.log("Sample : ", sample._id);
  Teacher.updateOne(
    { _id: sample.teacher },
    { $addToSet: { samples: [sample._id] } },
    (err) => {
      if (err) {
        res
          .status(400)
          .json({ message: "sample can't assigned to teacher", error: err });
      } else {
        res.status(200).json({ message: "Sample Created" });
      }
    }
  );
};

sampleRouter.post("/add", (req, res) => {
  console.log("Adding New sample : ", req.body);

  Sample.create(
    {
      name: req.body.name,
      teacher: req.body.teacher,
      duration: req.body.duration,
      noOfAyat: req.body.noOfAyat,
      joz2: req.body.joz2,
      avatar: req.body.avatar,
      url: req.body.url
    },
    (err, ins) => {
      if (err) {
        console.log("ERR : ", err);
        res.status(400).json({ message: "sample Not Created", error: err });
      } else {
        addSampleToTeacher(ins, res);
      }
    }
  );
});

sampleRouter.get("/teacher/:teacherID", (req, res) => {
  let tId = req.params.teacherID;
  Sample.find({ teacher: tId }, (err, data) => {
    if (err) {
      res.status(400).json({ message: "Samples Cann't Listed", error: err });
    } else {
      res.status(200).json({ samples: data });
    }
  });
});

sampleRouter.get("/", (req, res) => {
  Sample.find()
    .populate("teacher")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Samples Cann't Listed", error: err });
      } else {
        res.status(200).json({ samples: data });
      }
    });
});

export default sampleRouter;
