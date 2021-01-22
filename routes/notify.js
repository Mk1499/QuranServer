import express from "express";
import Notification from "../models/notification.js";
import User from "../models/student.js";
import Teacher from "../models/teacher.js";
import Admin from "../models/admin.js";

const notifyRouter = express.Router();

notifyRouter.post("/addwebtoken", (req, res) => {
  let { userId, userType, token } = req.body;
  switch (userType) {
    case "student":
      connectWebTokenToStudent(userId, token, res);
      break;
    case "teacher":
      connectWebTokenToTeacher(userId, token, res);
      break;
    case "admin":
      connectWebTokenToAdmin(userId, token, res);
      break;
  }
});

notifyRouter.post("/addmobiletoken", (req, res) => {
  let { userId, userType, token } = req.body;
  switch (userType) {
    case "student":
      connectMobileTokenToStudent(userId, token, res);
      break;
    case "teacher":
      connectMobileTokenToTeacher(userId, token, res);
      break;
    case "admin":
      connectMobileTokenToAdmin(userId, token, res);
      break;
  }
});

function connectWebTokenToStudent(userId, token, res) {
  User.updateOne(
    { _id: userId },
    { $set: { webDeviceToken: token } },
    (err, data) => {
      if (err) {
        res.status(400).json({ message: "Web Token Not Added", error: err });
      } else {
        res.status(200).json({ message: "Web Token Added", data });
      }
    }
  );
}

function connectWebTokenToTeacher(userId, token, res) {
  User.updateOne(
    { _id: userId },
    { $set: { webDeviceToken: token } },
    (err, data) => {
      if (err) {
        res.status(400).json({ message: "Web Token Not Added", error: err });
      } else {
        res.status(200).json({ message: "Web Token Added", data });
      }
    }
  );
}
function connectWebTokenToAdmin(userId, token, res) {
  User.updateOne(
    { _id: userId },
    { $set: { webDeviceToken: token } },
    (err, data) => {
      if (err) {
        res.status(400).json({ message: "Web Token Not Added", error: err });
      } else {
        res.status(200).json({ message: "Web Token Added", data });
      }
    }
  );
}

function connectMobileTokenToStudent(userId, token, res) {
  User.updateOne(
    { _id: userId },
    { $set: { mobileDeviceToken: token } },
    (err, data) => {
      if (err) {
        res.status(400).json({ message: "Mobile Token Not Added", error: err });
      } else {
        res.status(200).json({ message: "Mobile Token Added", data });
      }
    }
  );
}

function connectMobileTokenToTeacher(userId, token, res) {
  User.updateOne(
    { _id: userId },
    { $set: { mobileDeviceToken: token } },
    (err, data) => {
      if (err) {
        res.status(400).json({ message: "Mobile Token Not Added", error: err });
      } else {
        res.status(200).json({ message: "Mobile Token Added", data });
      }
    }
  );
}
function connectMobileTokenToAdmin(userId, token, res) {
  User.updateOne(
    { _id: userId },
    { $set: { mobileDeviceToken: token } },
    (err, data) => {
      if (err) {
        res.status(400).json({ message: "Mobile Token Not Added", error: err });
      } else {
        res.status(200).json({ message: "Mobile Token Added", data });
      }
    }
  );
}

export default notifyRouter;
