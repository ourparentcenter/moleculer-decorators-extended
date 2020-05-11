import esbuild from 'rollup-plugin-esbuild';
import autoExternal from 'rollup-plugin-auto-external';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  treeshake: true,
  output: {
    sourcemap: false,
    format: 'cjs',
    file: pkg.main
  },
  plugins: [
    autoExternal({
      builtins: true,
      peerDependencies: true,
      dependencies: true
    }),
    esbuild({
      minify: false,
      target: 'esnext'
    })
  ]
};
