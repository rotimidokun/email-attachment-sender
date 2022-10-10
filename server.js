const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

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
var uploadMultiple = upload.fields([
  { name: "file1", maxCount: 1 },
  { name: "file2", maxCount: 1 },
  { name: "file3", maxCount: 1 },
]);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  service: "gmail",
  auth: {
    user: "rotimidokun@gmail.com",
    pass: "wtubjyzdbyfwtccl",
  },
});

app.post("/sendEmail", uploadMultiple, (req, res) => {
  console.log("req", req.body);
  const { name, email, organization } = req.body;

  console.log(req.files, "path");
  // let attachments = [];
  // for (let i = 0; i < req.files.length; i++) {
  //   let fileDetails = {
  //     filename: req.files[i].filename,
  //     path: req.files[i].path,
  //   };
  //   attachments.push(fileDetails);
  // }

  const filesArray = Object.values(req.files);
  var mailOptions = {
    from: "cloudgadgets.ng@gmail.com",
    to: "dtc-nigeria@giz.de, emmanuel.oladele@giz.de",
    subject: `New DIH Application from ${organization}`,
    html: ` 
    <h1>Name of the (lead) applicant: ${name}</h1>
    <h1>Name of proposed Digital Innovation Hub: ${organization}</h1>
    <h1>Email address of contact person: ${email}</h1>
    `,
    attachments: filesArray.map((fileArray) => fileArray[0]),
  };

  // console.log('attachments', attachments.filename);
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

      fs.unlink(path, function (err) {
        if (err) {
          return res.end(err);
        } else {
          console.log("deleted");
        }
      });
    }
  });
});

app.get("/", (req, res) => {
  res.json({status: "200", message: "OK"})
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("Server has started");
  }
});
