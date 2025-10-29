
const fs      = require('fs');

const mail    = 'https://github.com/DWTechs/Gatlin-express.js';
const CRLF    = '\r\n';
const rel     = './';
const src     = `${rel}build/`;
const dest    = `${rel}dist/`; 
const files   = [
  {
    src:  `${rel}src/gatlin-express.d.ts`,
    dest: `${dest}gatlin-express.d.ts`
  },
  {
    src:  `${src}gatlin-express.mjs`,
    dest: `${dest}gatlin-express.js`
  },
];

fs.mkdir(dest, { recursive: false },(err) => {
  if (err) throw err;
  fs.readFile(`${rel}LICENSE`, (err, license) => {
    if (err) throw err;
    for (const file of files) {
      fs.readFile(file.src, (err, fileContent) => {
        if (err) throw err;
        fs.writeFile(file.dest, `/*${CRLF}${license}${CRLF}${mail}${CRLF}*/${CRLF}${CRLF}${fileContent}`, (err) => {
          if (err) throw err;
        });
      });
    }
  });
});