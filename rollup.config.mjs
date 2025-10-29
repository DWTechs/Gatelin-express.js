const config =  {
  input: "build/es6/gatlin-express.js",
  output: {
    name: "winstan",
    file: "build/gatlin-express.mjs",
    format: "es"
  },
  external: [
    "@dwtechs/checkard", 
    "@dwtechs/winstan",
  ],
  plugins: []
};

export default config;
