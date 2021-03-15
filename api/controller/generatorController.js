const { createReadStream, createWriteStream, readFile } = require('fs');
const { join, resolve } = require('path');
const latex = require('node-latex');
const pdf2base64 = require('pdf-to-base64');


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
  let titleTemplate = `\\documentclass[journal]{IEEEtran}
                      \\usepackage{xcolor,soul,framed}
                      \\colorlet{shadecolor}{yellow}
                      \\usepackage[pdftex]{graphicx}
                      \\graphicspath{{../pdf/}{../jpeg/}}
                      \\DeclareGraphicsExtensions{.pdf,.jpeg,.png}
                      \\usepackage[cmex10]{amsmath}
                      \\usepackage{array}
                      \\usepackage{mdwmath}
                      \\usepackage{mdwtab}
                      \\usepackage{eqparbox}
                      \\usepackage{url}
                      \\hyphenation{op-tical net-works semi-conduc-tor}
                      \\begin{document}
                      \\bstctlcite{IEEEexample:BSTcontrol}
                      \\title{${data.title}}
  \\author{Michael~Roberg,~\\IEEEmembership{Student Member,~IEEE,}
      Tibault~Reveyrand,~\\IEEEmembership{Member,~IEEE,}\\\\
      Ignacio~Ramos,~\\IEEEmembership{Student Member,~IEEE,}
      Erez Falkenstein,~\\IEEEmembership{Student Member,~IEEE,}
      and~Zoya~Popovi\\'c,~\\IEEEmembership{Fellow,~IEEE}% <-this % stops a space

  \\thanks{Manuscript received July 10, 2012. \\hl{This paper is an expanded paper from the IEEE MTT-S Int. Microwave Symposium held on June 17-22, 2012 in Montreal, Canada.} This work was funded in part by the Office of Naval Research under the Defense Advanced Research Projects Agency (DARPA) Microscale Power Conversion (MPC) Program under Grant N00014-11-1-0931, and in part by the Advanced Research Projects Agency-Energy (ARPA-E), U.S. Department of Energy, under Award Number DE-AR0000216.}
  \\thanks{M. Roberg is with TriQuint Semiconductor, 500 West Renner Road Richardson, TX 75080 USA (e-mail: michael.roberg@tqs.com).}% <-this % stops a space
  \\thanks{T. Reveyrand is with the XLIM Laboratory, UMR 7252, University of Limoges, 87060 Limoges, France (e-mail: tibault.reveyrand@xlim.fr).}%
  \\thanks{I. Ramos and Z. Popovic are with the Department of Electrical, Computer and Energy Engineering, University of Colorado, Boulder, CO, 80309-0425 USA (e-mail: ignacio.ramos@colorado.edu; zoya.popovic@colorado.edu).}% <-this % stops a space
  \\thanks{E. Falkenstein is with Qualcomm Inc., 6150 Lookout Road
Boulder, CO 80301 USA (e-mail: erez.falkenstein@gmail.com).}}


\\markboth{IEEE TRANSACTIONS ON MICROWAVE THEORY AND TECHNIQUES, VOL.~60, NO.~12, DECEMBER~2012
}{Roberg \\MakeLowercase{\\textit{et al.}}: High-Efficiency Diode and Transistor Rectifiers}


\\maketitle
 `;

  let authorTemplate = nameTemplateGen(data.names);

  // let affilTempalte = `\\affil{${data.department}, ${data.college}, ${data.location}}
  //                      \\doiinfo{DOI: 10.1109/JPHOT.2009.XXXXXXX\\\\
  //                      1943-0655/\\$25.00 \\copyright 2009 IEEE}%
  //                      \\maketitle
  //                      \\markboth{IEEE Photonics Journal}{Volume Extreme Ultraviolet Holographic Imaging}`;

  let abstractTemplate = `\\begin{abstract}
                         ${data.abstract}
                         \\end{abstract}
                         \\begin{IEEEkeywords}
                         ${data.indexTerms}
                         \\end{IEEEkeywords}
  `;

  let sectionTemplate = sectionTemplatesGen(data.sections);

  let ending = `
  \\begin{IEEEbiography}[{\\includegraphics[width=1in,height=1.25in,clip,keepaspectratio]{photo/erez.png}}]{Erez Avigdor Falkenstein}
(S'07), Haifa, Israel in 1979. He earned a “Handesaie” degree (associate degree) in electronics from Amal Handesaim School Hadera, Israel in 1999. From 1999 to 2003 he served in the Israel Defense Force as part of a technological unit. He has been at the University of Colorado at Boulder 2004 – 2012. He received concurrent MS/BS degrees in Electrical engineering 2010 and a Ph.D 2012 from the University of Colorado at Boulder. Since 2007 he has been involved with research as part of the active antenna group. Research emphasis: far field wireless powering for low power densities. Interests include Antenna design and characterization, modeling and measurement of nonlinear devices at microwave frequencies and power management. He is currently employed at Qualcomm, Incorporated, Boulder, CO.
\\end{IEEEbiography}
  \\end{document}`;

  let input = titleTemplate+authorTemplate+abstractTemplate+sectionTemplate+ending;


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
  console.log('jhsdbhsd');
  res.sendFile(join(__dirname,'output.pdf'),'output.pdf');
}

exports.generatePDF = (req, res)=>{
  makePDF(req.body);
  console.log(req.body);

  pdf2base64(join(__dirname,'output.pdf')).then((response) =>{
    console.log(response);
    res.status(200).json({
      status: "success",
      data: response,
      message: "Congrats! "
    });
  }).catch(
    (error) => {
      console.log(error); //Exepection error....
    });

  // readFile(join(__dirname,'output.pdf'),'base64',(err,data)=>{
  //   if (err) throw err;
  //   console.log('Log data:'+data);
  //
  //   res.status(200).json({
  //     status: "success",
  //     data: data,
  //     message: "Congrats! "
  //   });
  // })
}


