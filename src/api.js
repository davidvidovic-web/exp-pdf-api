const express = require("express");
const fileupload = require("express-fileupload");
const serverless = require('serverless-http')
const router = express.Router();
const app = express();
const { PDFDocument, StandardFonts } = require("pdf-lib");

router.use(fileupload({ createParentPath: true }));

router.post("/upload", async (req, res, next) => {
  const file = req.files.pdfFile;
  const buffer = file.data;
  const pdfDoc = await PDFDocument.load(buffer);
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  res.set("Content-Type", "application/pdf");
  res.send(Buffer.from(pdfBytes));
});

app.use('./netlify/functions/api',router)
module.exports.handler = serverless(app);
