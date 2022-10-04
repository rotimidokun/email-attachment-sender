const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (!fs.existsSync(__dirname + "/src/.temp")) {
      fs.mkdirSync(__dirname + "./src/.temp");
    }
    callback(null, "./src/.temp");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  service: "gmail",
  auth: {
    user: "rotimidokun@gmail.com",
    pass: "wtubjyzdbyfwtccl",
  },
});

app.post("/sendEmail", upload.array("attachments"), (req, res) => {
  const { name, email, organization } = req.body;
  let attachments = [];
  for (let i = 0; i < req.files.length; i++) {
    let fileDetails = {
      filename: req.files[i].filename,
      path: req.files[i].path,
    };
    attachments.push(fileDetails);
  }
  var mailOptions = {
    from: "cloudgadgets.ng@gmail.com",
    to: "rotimidokun@gmail.com",
    subject: "Testing Sample DIH Application Submission",
    html: `<h1>New Submission by Test User!</h1> 
    <h1>${name}</h1>
    <h1>${email}</h1>
    <h1>${organization}</h1>
    `,
    attachments: attachments,
  };

  // var mailOptions = {
  //   from: "cloudgadgets.ng@gmail.com",
  //   to: "rotimidokun@gmail.com",
  //   subject: "Testing Sample DIH Application Submission",
  //   html: "<h1>New Submission by Test User!</h1>",
  //   attachments: attachments,
  // };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.json({ status: "error", data: "Something went wrong" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ status: "ok", data: info });
    }
  });
});

app.get("/", (req, res) => {
    
})


app.listen(3000, (err) => {
  if (!err) {
    console.log("Server has started");
  }
});
