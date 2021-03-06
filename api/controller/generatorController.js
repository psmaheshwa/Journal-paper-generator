const { createReadStream, createWriteStream } = require('fs');
const { join, resolve } = require('path');
const latex = require('node-latex');


function makePDF(titleName){
  let input = `
  \\documentclass[]{IEEEphot}

\\jvol{xx}
\\jnum{xx}
\\jmonth{June}
\\pubyear{2009}

\\newtheorem{theorem}{Theorem}
\\newtheorem{lemma}{Lemma}

\\begin{document}
\\title{${titleName}}

\\author{P.~W.~Wachulak, M.~C.~Marconi,~\\IEEEmembership{Senior~Member,~IEEE},
R.~A.~Bartels,\\\\
C.~S. Menoni,~\\IEEEmembership{Fellow,~IEEE}, J.~J.~Rocca}

\\affil{NSF ERC for Extreme Ultraviolet Science \\& Technology and
Department of Electrical and Computer\\\\ Engineering, Colorado State
University, Fort Collins 80521 USA}

\\doiinfo{DOI: 10.1109/JPHOT.2009.XXXXXXX\\\\
1943-0655/\\$25.00 \\copyright 2009 IEEE}%

\\maketitle

\\markboth{IEEE Photonics Journal}{Volume Extreme Ultraviolet Holographic Imaging}


\\section{InAtroduction}

Holographic imaging in the soft X-ray (SXR) and extreme ultraviolet (EUV) have been demonstrated in several experiments realized using EUV/SXR lasers and synchrotron sources. These include the first realization of soft X-ray laser holography at Lawrence Livermore National Laboratory using a large laser facility, and the holographic recording of biological samples and sub-micron structures using soft X-ray radiation from synchrotrons, among other experiments \\cite{Mizuuchi2002, Mizuuchi2003}.  A key idea in these experiments is to use coherent short wavelength illumination to achieve a spatial resolution beyond the reach of visible light
\\end{document}
`
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
  makePDF(req.body.title);
  console.log(req.body);
  res.status(200).json({
    status:'success'
  })
}


