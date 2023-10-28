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

    npm i -D @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-typescript2 rollup-plugin-peer-deps-external rollup-plugin-postcss @rollup/plugin-terser rollup-plugin-dts

      npm i -D rimraf

     npm i -D @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript

### 插件

1.  @rollup/plugin-node-resolve- 解决第三方依赖node_modules
1.  @rollup/plugin-commonjs- 打包成commonjs格式
1.  rollup-plugin-typescript2 在 JS 中转译我们的 1.Typescript 代码
1.  rollup-plugin-peer-deps-external- 防止打包peerDependencies external将不用配置。
1.  rollup-plugin-postcss- 处理我们的 less scss ,autoprefixer加前缀 cssnano ：css压缩
1.  @rollup/plugin-terser - 缩小我们的包
1.  rollup-plugin-dts - 它获取我们所有的.d.ts文件并输出一个单一类型的文件
1.  @rollup/plugin-babel
1.  @rollup/plugin-alias 别名
1.  @rollup/plugin-inject 全局变量
1.  @rollup/plugin-replace 字符串替换
1.  @rollup/plugin-strip 删除console debugger

1.  rimraf 打包前删除文件夹

1.  cross-env 跨平台变量

### rollup配置

1. input 入口
1. external 忽略包
1. globals
1. output 出口
   1. file
   2. format
   3. sourcemap
1. plugins 插件

## tsconfig.json

      {
      "compilerOptions": {
      "baseUrl": ".",
      "outDir": "./lib", // 输出目录
      "sourceMap": false, // 是否生成sourceMap
      "target": "esnext", // 编译目标
      "module": "esnext", // 模块类型
      "moduleResolution": "node",
      "allowJs": false, // 是否编辑js文件
      "strict": true, // 严格模式
      "noUnusedLocals": true, // 未使用变量报错
      "experimentalDecorators": true, // 启动装饰器
      "resolveJsonModule": true, // 加载json
      "esModuleInterop": true,
      "removeComments": false, // 删除注释

         "declaration": true, // 生成定义文件
         "declarationMap": false, // 生成定义sourceMap
         "declarationDir": "./lib/types", // 定义文件输出目录


         "lib": ["esnext", "dom"],  // 导入库类型定义
         "types": ["node"] // 导入指定类型包

      },
      "include": [
      "src/*" // 导入目录
      ]
      }
