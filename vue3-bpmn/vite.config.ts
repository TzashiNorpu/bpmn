import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
// import { createVitePlugins } from './vitePlugin'
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const root: string = process.cwd()
  const env: Record<string, string> = loadEnv(mode, root)
  const isBuild: boolean = command === 'build'
  console.log('command', command)
  console.log('mode', mode)
  console.log('env', env)
  console.log('build', isBuild)
  return {
    build: {
      target: ['chrome91'],
      sourcemap: true,
      minify: false,
    },
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./types', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3003,
      proxy: {
        [env.VITE_BASE_URL]: {
          secure: false,
          target: env.VITE_ORIGIN,
          rewrite(path: string) {
            if (env['VITE_KEEP_API_PREFIX'] !== 'yes') {
              return path.replace(env.VITE_BASE_URL, '')
            }
            return path
          },
          headers: {
            Origin: env.VITE_ORIGIN,
          },
        },
      },
    },
  }
})
