import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [{
  input: "tsc/src/main.js",
  output: [
    { file: "dist/index.esm.js", format: "es" },
    { file: "dist/index.esm.min.js", format: "es", plugins: [terser()] },
    { file: "dist/index.umd.js", format: "umd", name: "WglAnim" },
    { file: "dist/index.umd.min.js", format: "umd", name: "WglAnim", plugins: [terser()] },
  ],
  plugins: [
    commonjs(),
    resolve({
      browser: true,
    }),
  ],
}];
