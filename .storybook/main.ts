import type { StorybookConfig } from '@storybook/vue3-vite'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

const config: StorybookConfig = {
  stories: ['../app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vue()],
      resolve: {
        alias: {
          '~': fileURLToPath(new URL('../app', import.meta.url)),
        },
      },
    })
  },
}

export default config
