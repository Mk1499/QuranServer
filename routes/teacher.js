import express from "express";
import Teacher from "../models/teacher.js";
import {
  studentActiveEnrollments,
  teacherActiveEnrollments,
} from "./enroll.js";

const teacherRouter = express.Router();

teacherRouter.post("/add", (req, res) => {
  console.log("Adding New teacher : ", req.body);
  let { webToken, mobileToken } = req.body;
  let newTeacher = {
    name: req.body.name,
    arName: req.body.arName,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
    price: req.body.price,
    role: "teacher",
  };

  if (webToken) {
    newTeacher["webDeviceToken"] = webToken;
  } else if (mobileToken) {
    newTeacher["mobileDeviceToken"] = mobileToken;
  }

  Teacher.create(newTeacher, (err, teacher) => {
    if (err) {
      res.status(400).json({ message: "teacher Not Created", error: err });
    } else {
      res.status(200).json({ message: "teacher Created", teacher });
    }
  });
});

teacherRouter.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let { webToken, mobileToken } = req.body;

  console.log("Teacher Login : ", email, password);

  if (email && password) {
    let enhEmail = email.toLowerCase();

    Teacher.findOne({
      email: enhEmail,
      password,
    }).exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "An Error Happened", error: err });
      } else if (data) {
        if (webToken) {
          Teacher.updateOne(
            {
              _id: data._id,
            },
            {
              $set: {
                webDeviceToken: webToken,
              },
            },
            (err) => {
              if (err) {
                res.status(404).json({ message: "Wrong Adding Device Token" });
              } else {
                data["webDeviceToken"] = webToken;
                res.status(200).json(data);
              }
            }
          );
        }
        if (mobileToken) {
          Teacher.updateOne(
            {
              _id: data._id,
            },
            {
              $set: {
                mobileDeviceToken: mobileToken,
              },
            },
            (err) => {
              if (err) {
                res.status(404).json({ message: "Wrong Adding Device Token" });
              } else {
                data["mobileDeviceToken"] = mobileToken;
                res.status(200).json(data);
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

teacherRouter.post("/addMany", (req, res) => {
  console.log("Adding New teachers : ", req.body);
  let tchers = req.body.teachers.map((t) => {
    return {
      name: t.name,
      arName: t.arName,
      email: t.email,
      password: t.password,
      avatar: t.avatar,
      price: t.price,
      role: "teacher",
    };
  });

  console.log("teacher s : ", tchers);

  Teacher.insertMany(tchers, (err, teacher) => {
    if (err) {
      res.status(400).json({ message: "teachers Not Created", error: err });
    } else {
      res.status(200).json({ message: "teachers Created", teacher });
    }
  });
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
    // .populate("samples")
    .exec(async (err, data) => {
      if (err) {
        res.status(400).json({ message: "teacher cannot found", error: err });
      } else {
        let enrollData = (await teacherActiveEnrollments(req, res, true)) || [];
        console.log("ENDATA : ", enrollData);
        data["students"] = enrollData.map((en) => en.studentID._id);
        res.status(200).json(data);
      }
    });
});

teacherRouter.get("/:id/students", async (req, res) => {
  let enrollData = (await teacherActiveEnrollments(req, res, true)) || [];
  let students = enrollData.map((i) => i.studentID);
  res.status(200).json(students);
});

teacherRouter.get("/:id/samples", (req, res) => {
  Teacher.findOne({ _id: req.params.id }, { _id: 0, samples: 1 })
    .populate("samples")
    .exec((err, data) => {
      if (err) {
        res.status(400).json({ message: "teacher cannot found", error: err });
      } else {
        console.log("SA : ", data);
        if (data) {
          data = data["samples"];
        }
        res.status(200).json(data || []);
      }
    });
});

export default teacherRouter;
