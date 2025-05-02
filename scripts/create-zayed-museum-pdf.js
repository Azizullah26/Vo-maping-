const PDFDocument = require("pdfkit")
const fs = require("fs")

// Create a document
const doc = new PDFDocument()

// Pipe its output somewhere, like to a file or HTTP response
doc.pipe(fs.createWriteStream("../public/data/zayed-national-museum.pdf"))

// Add the content
doc.fontSize(24).text("Zayed National Museum", { align: "center" })
doc.fontSize(18).text("Abu Dhabi, United Arab Emirates", { align: "center" })
doc.moveDown()
doc.fontSize(20).text("Falconer and Conservationist", { align: "center" })
doc.moveDown()
doc
  .fontSize(12)
  .text(`The Louvre, The Guggenheim and The Zayed National Museum (ZNM) anchor Abu Dhabi's cultural district of Saadiyat Island. The ZNM tells the story of the United Arab Emirates and the central role Sheikh Zayed bin Sultan Al Nahyan played in its foundation.

APA partnered with the British Museum to design the Museum's Falconry Gallery, exploring Sheikh Zayed's passion for falconry and revealing its connections to the Emirates' conservation values. Visitors gain a deep appreciation for Arabian traditions through cutting-edge technology, personal stories and priceless historic objects.`)

// Finalize PDF file
doc.end()

console.log("Zayed National Museum PDF created successfully.")
