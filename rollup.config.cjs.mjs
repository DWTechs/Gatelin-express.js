import resolve from "@rollup/plugin-node-resolve";

const config =  {
  input: "build/es6/gatlin-express.js",
  output: {
    name: "winstan",
    file: "build/gatlin-express.cjs.js",
    format: "cjs"
  },
  external: [
  ],
  plugins: [
    resolve({
      mainFields: ['module', 'main']
    }),
  ]
};

export default config;