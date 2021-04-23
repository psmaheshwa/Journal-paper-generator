const {readFileSync, createWriteStream, readFile} = require('fs');
const {join, resolve} = require('path');
const latex = require('node-latex');
const pdf2base64 = require('pdf-to-base64');
const {templateSelection} = require("./Template-selection");

function makePDF(data) {
  const output = createWriteStream(join(__dirname, 'output.pdf'));
  const options = {
    inputs: resolve(join(__dirname, 'tex-inputs'))
  }
  const pdf = latex(templateSelection(data), options)

  pdf.pipe(output)
  pdf.on('error', err => console.error(err))
  pdf.on('finish', () => console.log('PDF generated!'))
}


exports.downloadPDF = (req, res) => {
  console.log('jhsdbhsd');
  res.sendFile(join(__dirname, 'output.pdf'), 'output.pdf');
}

exports.generatePDF = (req, res) => {
  makePDF(req.body);
  console.log(req.body);

  // pdf2base64(join(__dirname, 'output.pdf')).then((response) => {
  //   console.log("Response :"+response);
  //   res.status(200).json({
  //     status: "success",
  //     data: response,
  //     message: "Congrats! "
  //   });
  // }).catch(
  //   (error) => {
  //     console.log(error);
  //   });
  var binaryData = readFileSync('/home/mahesh/Desktop/frontend/api/controller/Template-selection.js');
  console.log(binaryData.toString());
  res.status(200).json({
    data: new Buffer(binaryData).toString("base64")
  })

}


