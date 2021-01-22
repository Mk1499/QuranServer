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

export function sendNotification(body, token) {
  let authKey =
    "AAAAy2xgfNM:APA91bF5y18uU2sCqRn3H5-7CWmiuYsR3ydTqFyxn43iHUHI_59LWHSJAvXHf-f-QGM72DPjLrGBZAjg3b14MwfTCJsRAhzRiUllGumNrES925brXLwYm03DzE7WHrlgPTJduaST7Pm4";
  fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${authKey}`,
    },
    body: {
      notificatoion: {
        title: body.title,
        body: body.body,
        link: body.link,
      },
      to: token,
    },
  });
}

export default notifyRouter;
