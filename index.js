const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const helpers = require('./helpers');

const app = express();
const port = process.env.PORT || 6100;
app.use(express.static(__dirname + '/public'));
app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

app.post('/images/upload', (req, res) => {
  console.log(req.body);
  // 'picture' is the name of our file input field in the HTML form
  let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');

  upload(req, res, function(err) {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any

    // console.log(req)
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    else if (!req.file) {
      return res.send('Please select an image to upload');
    }
    else if (err instanceof multer.MulterError) {
      return res.send(err);
    }
    else if (err) {
      return res.send(err);
    }

    // Display uploaded image for user validation
    res.json({
      "status": "OK",
      "code": 200,
      "path": req.file.path,
    });
  });
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

