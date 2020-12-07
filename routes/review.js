import express from "express";
import Review from "../models/review.js";

const reviewRouter = express.Router();

reviewRouter.post("/add", (req, res) => {
  console.log("Adding New Review : ", req.body);

  Review.create(
    
      {
        title: req.body.title,
        body: req.body.body,
        student: req.body.student,
        teacher: req.body.teacher,
      },
    (err) => {
      if (err) {
        res.status(400).json({ message: "Review Not Created", error: err });
      } else {
        res.status(200).json({ message: "Review Created" });
      }
    }
  );
});

reviewRouter.get("/teacher/:teacherID", (req, res) => {
  let tID = req.params.teacherID;

  Review.find({ teacher: tID })
    .populate("student")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "Cannot Get Review", error: err });
      } else {
        console.log("Data : ", data);
        res.status(200).json({
          message: "teacher : " + req.params.teacherID,
          data,
        });
      }
    });
});

export default reviewRouter;
