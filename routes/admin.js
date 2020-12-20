import express from "express";
import Admin from "../models/admin.js";

const adminRouter = express.Router();

adminRouter.post("/login", (req, res) => {
  let recEmail = req.body.email;
  let password = req.body.password;
  let email;
  if (recEmail && password) {
    email = recEmail.toLowerCase();
    Admin.findOne({
      email,
      password,
    })
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ message: "Wrong email or password" });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "An Error Happened", error: err });
      });
  } else {
    res.status(400).json({ message: "An Error Happened", error: "Email and Password Required" });
  }
});

adminRouter.post("/add", (req, res) => {
  let { name, email, password } = req.body;




  let admin = new Admin({
    email,
    password,
    name,
  });
  admin
    .save()
    .then((data) => {
      res.status(200).json({ admin: data });
    })
    .catch((err) => {
      res.status(400).json({ message: "An Error Happened", error: err });
    });
});

export default adminRouter;
