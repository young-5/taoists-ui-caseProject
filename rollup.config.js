import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'; // 插件将CommonJS转换为ES6版本
import resolve from '@rollup/plugin-node-resolve'; // 解析Node.js模块 插件允许我们加载第三方模块,检查模块的package.json文件以确定模块的主文件位置，并解决模块之间的依赖关系。此外，它还可以解析模块的绝对路径和相对路径，确保正确地解析和加载模块。
import terser from '@rollup/plugin-terser'; // 代码压缩
import dts from 'rollup-plugin-dts'
import external from 'rollup-plugin-peer-deps-external'; // 版本冲突 代替external
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'; // TypeScript代码转换
// const packageJson = ./package.json
const packageJson = {
  main: 'dist/cjs/index.js',
  module: 'dist/esm/index.js',
  types: 'dist/esm/index.d.ts'
}

// babel配置
const babelOptions = {
  presets: ['@babel/preset-env'],
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
  exclude: '**/node_modules/**'
}
// ES Module打包输出
const esmOutput = {
  preserveModules: true,
  // preserveModulesRoot: 'src',
  // exports: 'named',
  assetFileNames: ({ name }) => {
    const { ext, dir, base } = path.parse(name)
    if (ext !== '.css') return '[name].[ext]'
    return path.join(dir, 'style', base)
  }
}

const entry = 'src/index.ts'

export default [
  {
    input: entry,
    external: [
      'ms',
      'react',
      'react-dom',
      'classnames',
      'typescript',
      'antd',
      'lodash',
      '@types/lodash'
    ],
    globals: {
      lodash: '_'
    },
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: 'rollup-react-lib'
      },
      { filname: 'index.esm.js', dir: 'dist/es/', format: 'esm', sourcemap: false }
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
      postcss({
        //plugins: [autoprefixer(), cssnano()
        extract: 'dist/css/index.css'
      }),
      terser(),
      babel(babelOptions)
    ]
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/esm/type/index.d.ts', format: 'esm' }],
    external: [/\.scss$/],
    plugins: [dts()]
  }
]
