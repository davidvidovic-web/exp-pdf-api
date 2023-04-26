const express = require("express");
const fileupload = require("express-fileupload");
const port = process.env.PORT || 5030;
const app = express();
const { PDFDocument, StandardFonts } = require("pdf-lib");

app.use(fileupload({ createParentPath: true }));

app.post("/upload", async (req, res, next) => {
  const file = req.files.pdfFile;
  const buffer = file.data;
  const pdfDoc = await PDFDocument.load(buffer);
  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  console.log('File accepted');
  res.set("Content-Type", "application/pdf");
  res.send(Buffer.from(pdfBytes));
});

app.listen(port, () => console.log(`listening on port ${port}`));
