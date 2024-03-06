const express = require("express");
const fileupload = require("express-fileupload");
const port = process.env.PORT || 5030;
const app = express();
const {
  PDFDocument,
  StandardFonts,
  degrees,
  getRotation,
  angle,
} = require("pdf-lib");

app.use(fileupload({ createParentPath: true }));

app.post("/upload", async (req, res, next) => {
  const file = req.files.pdfFile;
  const buffer = file.data;
  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(buffer);
  } catch (error) {
    console.error("Error loading PDF document:", error);
    //return the same PDF file if it's not a valid PDF
    res.set("Content-Type", "application/pdf");
    res.send(buffer);
    return;
  }
  const pages = pdfDoc.getPages();

  for (var i = 0; i <= pages.length; i++) {
    if (pages[i] != undefined) {
      var orientation = pages[i].getRotation().angle;
      if (orientation == 90 || orientation == 270) {
        pages[i].setRotation(degrees(180));
      }
    }
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

  res.set("Content-Type", "application/pdf");
  res.send(Buffer.from(pdfBytes));
  console.log("File accepted & converted");
});

app.listen(port, () => console.log(`listening on port ${port}`));
