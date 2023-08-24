import esbuild from 'rollup-plugin-esbuild';
import autoExternal from 'rollup-plugin-auto-external';
import { createRequire } from 'module';
import resolve from '@rollup/plugin-node-resolve';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
// import pkg from './package.json' assert { type: 'json' };

export default () => {
  const mainInput = {
    input: 'src/index.ts',
    treeshake: true,
    output: {
      sourcemap: false,
      format: 'cjs',
      file: pkg.main
    },
    plugins: [
      resolve(),
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
  const esmInput = {
    ...mainInput,
    output: {
      sourcemap: false,
      format: 'esm',
      file: pkg.module
    }
  };
  return [mainInput, esmInput];
};
