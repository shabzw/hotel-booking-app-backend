import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

// Specify the path to the plugin (adjust as needed)
import nodeResolvePlugin from '@rollup/plugin-node-resolve';

export default {
  input: 'index.mjs',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [
    nodeResolvePlugin(), // Use the explicitly imported plugin
    commonjs(),
    json(),
  ],
};