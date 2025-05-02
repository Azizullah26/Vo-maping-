const PDFDocument = require("pdfkit")
const fs = require("fs")

// Create a document
const doc = new PDFDocument()

// Pipe its output somewhere, like to a file or HTTP response
doc.pipe(fs.createWriteStream("../public/alapn-co-pan-arab.pdf"))

// Add some content
doc.fontSize(25).text("Alapn.co – Pan Arab", 100, 100)
doc.fontSize(18).text("Sample Document", 100, 150)
doc.fontSize(12).text("This is a sample PDF document created for testing purposes.", 100, 200)

// Finalize PDF file
doc.end()

console.log("Sample PDF created successfully.")
