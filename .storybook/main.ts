import type { StorybookConfig } from '@storybook/react-webpack5'
const path = require('path')
const config: StorybookConfig = {
  //使用scss,使用前记得安装对应的loader
  webpackFinal: async (config, { configType }) => {
    config?.module?.rules &&
      config?.module?.rules.push({
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../')
      })
    config?.module?.rules &&
      config?.module?.rules.push({
        test: /\.less$/,
        use: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, '../')
      })

    // Return the altered config
    return config
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
}

export default config
