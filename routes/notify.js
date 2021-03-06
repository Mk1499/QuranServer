import express from "express";
import Notification from "../models/notification.js";
import User from "../models/student.js";
import Teacher from "../models/teacher.js";
import Admin from "../models/admin.js";

import axios from "axios";

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

notifyRouter.post("/user", (req, res) => {
  let { recieverId, recieverType } = req.body;
  console.log(req.body);
  Notification.find({
    reciever: recieverId,
    recieverType,
  }).exec((err, data) => {
    if (err) {
      res
        .status(400)
        .json({ message: "Cannot list user Notifications", error: err });
    } else {
      res.status(200).json(data);
    }
  });
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
  console.log("Sending New Push notification : " ,body );
  let authKey =
    "AAAAy2xgfNM:APA91bF5y18uU2sCqRn3H5-7CWmiuYsR3ydTqFyxn43iHUHI_59LWHSJAvXHf-f-QGM72DPjLrGBZAjg3b14MwfTCJsRAhzRiUllGumNrES925brXLwYm03DzE7WHrlgPTJduaST7Pm4";

  let reqBody = {
    notification: {
      title: body.title,
      body: body.body,
      click_action: body.click_action,
      route: body.route,
      data: body.data,
    },

    notification: {
      sound: "default",
      body: body.body,
      title: body.title,
      content_available: true,
      priority: "high",
    },
    data: {
      sound: "default",
      content_available: true,
      priority: "high",
      url: body.data.url,
      param: body.data.param
    },
    to: token,
  };

  axios
    .post("https://fcm.googleapis.com/fcm/send", reqBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${authKey}`,
      },
    })
    .then((res) => {
      console.log("Note Res : ", res);
    })
    .catch((err) => {
      console.log("Note Err : ", err);
    });
}

export function createNote(body) {
  let note = {
    title: body.title,
    body: body.body,
    click_action: body.click_action,
    reciever: body.recieverId,
    recieverType: body.recieverType,
    date: body.date,
  };
  Notification.create(note);
}

export default notifyRouter;
