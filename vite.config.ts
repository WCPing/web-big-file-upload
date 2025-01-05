import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        sourcemap: true,
    },
    server: {
        port: 3333,
        open: true, // 自动打开默认浏览器并
        hmr: { // 错误全屏警告，可以关闭
            overlay: true,
        },
    },
})
