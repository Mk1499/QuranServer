import express from "express";
import mongoose from "mongoose";

import Enroll from "../models/enroll.js";
import UnEnroll from "../models/unEnroll.js";

const enrollRouter = express.Router();

enrollRouter.post("/", (req, res) => {
  addEnroll(req, res);
});
enrollRouter.post("/remove", (req, res) => {
  removeEnroll(req, res);
});
enrollRouter.get("/all", (req, res) => allEnrollments(req, res));
enrollRouter.get("/all/grouped", (req, res) => allEnrollmentsGrouped(req, res));
enrollRouter.get("/all/active", (req, res) => allActiveEnrollments(req, res));
enrollRouter.get("/all/active/grouped", (req, res) => allActiveEnrollmentsGrouped(req, res));
enrollRouter.get("/student/:id", (req, res) => studentEnrollments(req, res));
enrollRouter.get("/teacher/:id", (req, res) => teacherEnrollments(req, res));
enrollRouter.get("/student/:id/active", (req, res) =>
  studentActiveEnrollments(req, res)
);
enrollRouter.get("/student/:id/active/grouped", (req, res) =>
  studentActiveEnrollmentsGrouped(req, res)
);
enrollRouter.get("/teacher/:id/active", (req, res) =>
  teacherActiveEnrollments(req, res)
);
enrollRouter.get("/teacher/:id/active/grouped", (req, res) =>
  teacherActiveEnrollmentsGrouped(req, res)
);
enrollRouter.get("/unenrolls", (req, res) => allUnEnrollments(req, res));
enrollRouter.get("/unenrolls/grouped", (req, res) =>
  allUnEnrollmentsGrouped(req, res)
);
enrollRouter.get("/unenrolls/teacher/:id/grouped", (req, res) =>
  teacherUnEnrollmentsGrouped(req, res)
);

//Grouped
export const allEnrollmentsGrouped = (req, res) => {
  Enroll.aggregate(
    [
      {
        $group: {
          _id: {
            year: { $year: "$dateTime" },
            month: { $month: "$dateTime" },
            // day: { $dayOfMonth: "$dateTime" },
          },
          count: { $sum: 1 },
          enrolls: { $push: "$_id" },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Error Getting Enrolments ordered", error: err });
      } else {
        res.status(200).json(data);
      }
    }
  );
};
export const allActiveEnrollmentsGrouped = (req, res) => {
  Enroll.aggregate(
    [
      {
        $match: {
          active: true,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateTime" },
            month: { $month: "$dateTime" },
            // day: { $dayOfMonth: "$dateTime" },
          },
          count: { $sum: 1 },
          enrolls: { $push: "$_id" },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Error Getting Enrolments ordered", error: err });
      } else {
        res.status(200).json(data);
      }
    }
  );
};
export const allUnEnrollmentsGrouped = (req, res) => {
  UnEnroll.aggregate(
    [
      {
        $group: {
          _id: {
            year: { $year: "$dateTime" },
            month: { $month: "$dateTime" },
            // day: { $dayOfMonth: "$dateTime" },
          },
          count: { $sum: 1 },
          enrolls: { $push: "$_id" },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Error Getting Enrolments ordered", error: err });
      } else {
        res.status(200).json(data);
      }
    }
  );
};
export const teacherActiveEnrollmentsGrouped = (req, res) => {
  Enroll.aggregate(
    [
      {
        $match: {
          teacherID: new mongoose.Types.ObjectId(req.params.id),
          active: true,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateTime" },
            month: { $month: "$dateTime" },
            // day: { $dayOfMonth: "$dateTime" },
          },
          count: { $sum: 1 },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res.status(400).json({
          message: "Error Getting Teacher Enrolments ordered",
          error: err,
        });
      } else {
        res.status(200).json(data);
      }
    }
  );
};
export const studentActiveEnrollmentsGrouped = (req, res) => {
  Enroll.aggregate(
    [
      {
        $match: {
          studentID: new mongoose.Types.ObjectId(req.params.id),
          active: true,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateTime" },
            month: { $month: "$dateTime" },
            day: { $dayOfMonth: "$dateTime" },
          },
          count: { $sum: 1 },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res.status(400).json({
          message: "Error Getting Student Enrolments ordered",
          error: err,
        });
      } else {
        res.status(200).json(data);
      }
    }
  );
};
export const teacherUnEnrollmentsGrouped = (req, res) => {
  UnEnroll.aggregate(
    [
      {
        $match: {
          teacherID: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$dateTime" },
            month: { $month: "$dateTime" },
            // day: { $dayOfMonth: "$dateTime" },
          },
          count: { $sum: 1 },
          enrolls: { $push: "$_id" },
        },
      },
    ],
    (err, data) => {
      if (err) {
        res
          .status(400)
          .json({ message: "Error Getting Enrolments ordered", error: err });
      } else {
        res.status(200).json(data);
      }
    }
  );
};
// Complete
export const allEnrollments = (req, res, external = false) => {
  Enroll.find({}, (err, data) => {
    if (err) {
      if (!external)
        res
          .status(400)
          .json({ message: "Error Getting Enrolments", error: err });
      else {
        return null;
      }
    } else {
      if (!external)
        res.status(200).json({
          data,
        });
      else {
        return data;
      }
    }
  });
};
export const allActiveEnrollments = (req, res, external = false) => {
  Enroll.find(
    {
      active: true,
    },
    (err, data) => {
      if (err) {
        if (!external)
          res
            .status(400)
            .json({ message: "Error Getting Enrolments", error: err });
        else {
          return null;
        }
      } else {
        if (!external)
          res.status(200).json({
            data,
          });
        else {
          return data;
        }
      }
    }
  );
};
export const studentEnrollments = async (req, res, external = false) => {
  // let teachers = [];

  return await new Promise((resolve, reject) => {
    Enroll.find({ studentID: req.params.id }, (err, data) => {
      if (err) {
        reject(err);
        console.log("ERR : Here : ", err);
      } else {
        resolve(data);
      }
    })
      .then((data) => {
        if (!external) {
          console.log("Hook");
          res.status(200).json({
            data,
          });
        }
      })
      .catch((err) => {
        if (!external)
          res
            .status(400)
            .json({ message: "Error Getting Enrolments", error: err });
      });
  });
};
export const studentActiveEnrollments = async (req, res, external = false) => {
  // let teachers = [];

  return await new Promise((resolve, reject) => {
    Enroll.find({ studentID: req.params.id, active: true }, (err, data) => {
      if (err) {
        reject(err);
        console.log("ERR : Here : ", err);
      } else {
        resolve(data);
      }
    })
      .then((data) => {
        if (!external) {
          console.log("Hook");
          res.status(200).json({
            data,
          });
        }
      })
      .catch((err) => {
        if (!external)
          res
            .status(400)
            .json({ message: "Error Getting Enrolments", error: err });
      });
  });
};
export const teacherEnrollments = async (req, res, external = false) => {
  // let teachers = [];

  return await new Promise((resolve, reject) => {
    Enroll.find({ teacherID: req.params.id }, (err, data) => {
      if (err) {
        reject(err);
        console.log("ERR : Here : ", err);
      } else {
        resolve(data);
      }
    })
      .then((data) => {
        if (!external) {
          console.log("Hook");
          res.status(200).json({
            data,
          });
        }
      })
      .catch((err) => {
        if (!external)
          res
            .status(400)
            .json({ message: "Error Getting Enrolments", error: err });
      });
  });
};
export const teacherActiveEnrollments = async (req, res, external = false) => {
  // let teachers = [];

  return await new Promise((resolve, reject) => {
    Enroll.find({ teacherID: req.params.id, active: true }, (err, data) => {
      if (err) {
        reject(err);
        console.log("ERR : Here : ", err);
      } else {
        resolve(data);
      }
    })
      .then((data) => {
        if (!external) {
          console.log("Hook");
          res.status(200).json({
            data,
          });
        }
      })
      .catch((err) => {
        if (!external)
          res
            .status(400)
            .json({ message: "Error Getting Enrolments", error: err });
      });
  });
};
export const addEnroll = (req, res) => {
  let { studentID, teacherID } = req.body;

  new Promise((resolve, reject) => {
    Enroll.find({ studentID, teacherID, active: true }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        if (data.length) {
          reject("Enrolled Before");
        } else {
          resolve();
        }
      }
    });
  })
    .then(() => {
      new Promise((resolve, reject) => {
        Enroll.create(
          {
            studentID,
            teacherID,
          },
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve({ message: "Enroll Created", data });
            }
          }
        );
      })
        .then((data) => {
          res.status(200).json(data);
        })
        .catch((err) => {
          res.status(400).json({ message: "Enroll Not Created", error: err });
        });
    })

    .catch((err) => {
      res.status(400).json({ message: "Enroll Not Created", error: err });
    });
};
export const removeEnroll = (req, res) => {
  console.log("Removing Enrollment : ", req.body);

  new Promise((resolve, reject) => {
    Enroll.find(
      {
        studentID: req.body.studentID,
        teacherID: req.body.teacherID,
        active: true,
      },
      (err, prevE) => {
        if (err || !prevE.length) {
          reject({
            message: "Not Active enrollment between stuedent and teacher",
            error: err || prevE.length,
          });
        } else {
          resolve();
        }
      }
    );
  })
    .then(() => {
      new Promise((resolve, reject) => {
        Enroll.updateMany(
          {
            studentID: req.body.studentID,
            teacherID: req.body.teacherID,
          },
          {
            $set: {
              active: false,
            },
          },
          (err, data) => {
            console.log("Data : ", data);
            if (err) {
              reject({
                message: "error while deactivating enrollment",
                error: err,
              });
            } else {
              resolve();
            }
          }
        );
      });
    })
    .then(() => {
      UnEnroll.create(
        {
          studentID: req.body.studentID,
          teacherID: req.body.teacherID,
        },
        (err) => {
          if (err)
            throw {
              message: "error while creating unenrollment",
              error: err,
            };
        }
      );
    })
    .then(() => {
      res.status(200).json({ message: "Enroll Removed" });
    })

    .catch((err) => {
      res.status(400).json(err);
    });
};

export const allUnEnrollments = (req, res) => {
  UnEnroll.find({})
    .then((data) => {
      console.log("UnEnrolls : ", data);
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({
        message: "Cann't get all unenrolls",
        error: err,
      });
    });
};

export default enrollRouter;
