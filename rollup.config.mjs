const config =  {
  input: "build/es6/gatelin-express.js",
  output: {
    name: "winstan",
    file: "build/gatelin-express.mjs",
    format: "es"
  },
  external: [
    "@dwtechs/checkard", 
    "@dwtechs/winstan",
  ],
  plugins: []
};

export default config;
