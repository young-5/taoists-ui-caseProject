# 组件库开发

## 项目初始化

1. 项目搭建

   基于项目的技术框架，选择对应的脚手架进行项目搭建。如：

   1. react :creact-react-app creact-next-app

   或者 mpm init 进行裸创

2. 添加依赖

   裸创：注意依赖的位置：devDependencies，dependencies

   npm i -D react react-dom typescript @types/react // 添加依赖项

   npx tsc --init // 添加tsconfig.json

3. storybook 引入

   npx sb init

   "storybook": "storybook dev -p 6006",

## 项目配置

1. git配置
2. 代码规范+格式化

   1. eslint
   2. prettierrc
   3. tsconfig
   4. husky：pre-commit/commit-msg
   5. commitlint.config

3. less/sass支持

   sass-loader

4. antd 支持

## rollup 打包构建

    npm i -D rollup

    npm i -D @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-typescript2 rollup-plugin-peer-deps-external rollup-plugin-postcss rollup-plugin-terser rollup-plugin-dts
