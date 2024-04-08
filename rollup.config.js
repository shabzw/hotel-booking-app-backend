import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'; // Import the @rollup/plugin-json

export default {
  input: 'index.js', // Entry point of your backend application
  output: {
    file: 'dist/bundle.js', // Output bundle file
    format: 'es', // Output format (CommonJS)
  },
  plugins: [
    nodeResolve(), // Resolve modules from node_modules
    commonjs(), // Convert CommonJS modules to ES modules (if needed)
    json(), // Enable JSON importing for Rollup
  ],
};
