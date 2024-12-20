import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import path from 'path';
import File from "../mongodb/models/file.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
  },
});
const upload = multer({ storage: storage });


router.route('/').post(upload.single('file'), async (req, res) => {
  try {
    // Handle file upload logic here


    const originalFilename = req.file.originalname;
    const filePath = '/uploads/' + req.file.filename;

    const newFile = new File({originalFilename, filePath });
    newFile.save();

    // Return relevant information in the response
    res.status(200).json({
      file: newFile,

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
