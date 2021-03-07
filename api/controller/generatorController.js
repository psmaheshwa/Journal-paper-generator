const { createReadStream, createWriteStream } = require('fs');
const { join, resolve } = require('path');
const latex = require('node-latex');


function nameTemplateGen(names){
  let nameTemplate = `\\author{`;
  for(let i = 0; i < names.length; i++){
    nameTemplate += `${names[i].firstname} ${names[i].lastname}, `;
  }
  return nameTemplate+'}';
}

function sectionTemplatesGen(sections) {
  let sectionTemplate = ``;
  for(let i =0; i < sections.length; i++){
    sectionTemplate +=  `\\section{${sections[i].sectionTitle}}
                          ${sections[i].sectionContent}`
  }
  return sectionTemplate;
}


function makePDF(data){
  let titleTemplate = `\\documentclass[]{IEEEphot}
                       \\jvol{xx}
                       \\jnum{xx}
                       \\jmonth{June}
                       \\pubyear{2009}
                       \\newtheorem{theorem}{Theorem}
                       \\newtheorem{lemma}{Lemma}
                       \\begin{document}
                       \\title{${data.title}} `;

  let authorTemplate = nameTemplateGen(data.names);

  let affilTempalte = `\\affil{${data.department}, ${data.college}, ${data.location}}
                       \\doiinfo{DOI: 10.1109/JPHOT.2009.XXXXXXX\\\\
                       1943-0655/\\$25.00 \\copyright 2009 IEEE}%
                       \\maketitle
                       \\markboth{IEEE Photonics Journal}{Volume Extreme Ultraviolet Holographic Imaging}`;

  let abstractTemplate = `\\begin{abstract}
                         ${data.abstract}
                         \\end{abstract}
                         \\begin{IEEEkeywords}
                         ${data.indexTerms}
                         \\end{IEEEkeywords}
  `;

  let sectionTemplate = sectionTemplatesGen(data.sections);

  let ending = `\\end{document}`;

  let input = titleTemplate+authorTemplate+affilTempalte+abstractTemplate+sectionTemplate+ending;


  const output = createWriteStream(join(__dirname, 'output.pdf'));
  const options = {
    inputs: resolve(join(__dirname, 'tex-inputs')) // This can be an array of paths if desired
  }
  const pdf = latex(input,options)

  pdf.pipe(output)
  pdf.on('error', err => console.error(err))
  pdf.on('finish', () => console.log('PDF generated!'))
}


exports.downloadPDF = (req,res)=>{
  res.download(join(__dirname,'generatorController.js'),'sdf.txt');
}

exports.generatePDF = (req, res)=>{
  makePDF(req.body);
  console.log(req.body);
  res.status(200).json({
    status:'success'
  })
}


