import express from "express";

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
enrollRouter.get("/student/:id", (req, res) => studentEnrollments(req, res));
enrollRouter.get("/teacher/:id", (req, res) => teacherEnrollments(req, res));
enrollRouter.get("/student/:id/active", (req, res) =>
  studentActiveEnrollments(req, res)
);
enrollRouter.get("/teacher/:id/active", (req, res) =>
  teacherActiveEnrollments(req, res)
);
enrollRouter.get("/unenrolls", (req, res) => allUnEnrollments(req, res));

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
export const studentEnrollments = async (req, res, external = false) => {
  console.log("Called", req.params);
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
  console.log("Called", req.params);
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
  console.log("Called", req.params);
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
  console.log("Called", req.params);
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
