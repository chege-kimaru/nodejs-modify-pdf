const { degrees, PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

(async () => {
  // This should be a Uint8Array or ArrayBuffer
  // This data can be obtained in a number of different ways
  // If your running in a Node environment, you could use fs.readFile()
  // In the browser, you could make a fetch() call and use res.arrayBuffer()
  const existingPdfBytes = await readFile("to-modify.pdf");

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Embed the Helvetica font
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Get the width and height of the first page
  const { width, height } = firstPage.getSize();

  // Draw a string of text diagonally across the first page
  firstPage.drawText("This text was added with JavaScript!", {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  await writeFile(path.resolve(__dirname, "file-modified.pdf"), pdfBytes);

  // For example, `pdfBytes` can be:
  //   • Written to a file in Node
  //   • Downloaded from the browser
  //   • Rendered in an <iframe>
})();
