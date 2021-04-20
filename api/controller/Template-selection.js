function template2(data) {
  return `q`
}

exports.templateSelection = (data) => {
  if(data.choice === 'IEEE')
      return template1(data);
  if(data.choice === 'IET')
      return template2(data);
  return template1(data);
}

function nameTemplateGen(names) {
  let nameTemplate = `\\author{`;
  for (let i = 0; i < names.length; i++) {
    nameTemplate += `${names[i].firstname} ${names[i].lastname}, `;
  }
  return nameTemplate + '}';
}
function sectionTemplatesGen(sections) {
  let sectionTemplate = ``;
  for (let i = 0; i < sections.length; i++) {
    sectionTemplate += `\\section{${sections[i].sectionTitle}}
                          ${sections[i].sectionContent}`
  }
  return sectionTemplate;
}

function template1(data){
  let authorTemplate = nameTemplateGen(data.names);
  let titleTemplate = `\\documentclass[journal]{IEEEtran}
                      \\usepackage{xcolor,soul,framed}
                      \\colorlet{shadecolor}{yellow}
                      \\usepackage[pdftex]{graphicx}
                      \\graphicspath{{../pdf/}{../jpeg/}}
                      \\DeclareGraphicsExtensions{.pdf,.jpeg,.png}
                      \\usepackage{array}
                      \\usepackage{mdwmath}
                      \\usepackage{mdwtab}
                      \\usepackage{eqparbox}
                      \\usepackage{url}
                      \\hyphenation{op-tical net-works semi-conduc-tor}
                      \\begin{document}
                      \\bstctlcite{IEEEexample:BSTcontrol}
                      \\title{${data.title}}
                      ${authorTemplate}
                      \\markboth{${data.title}}{Roberg \\MakeLowercase{\\textit{et al.}}: High-Efficiency Diode and Transistor Rectifiers}
                      \\maketitle
 `;
  let abstractTemplate = `\\begin{abstract}
                         ${data.abstract}
                         \\end{abstract}
                         \\begin{IEEEkeywords}
                         ${data.indexTerms}
                         \\end{IEEEkeywords}
  `;

  let sectionTemplate = sectionTemplatesGen(data.sections);
  let ending = `\\end{document}`;
  return titleTemplate+abstractTemplate+sectionTemplate+ending;
}
