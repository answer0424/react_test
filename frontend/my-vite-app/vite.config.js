import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/react_test/',  // GitHub Pages의 레포지토리 이름으로 설정
    css: {
        preprocessorOptions: {
            css: {}
        }
    },
    cssCodeSplit: false,    // 모든 css를 하나의 파일로 번들링
    server: {
        open: '/react_test/#/login', // 개발 서버 시작 시 로그인 페이지로 열기
    }
})