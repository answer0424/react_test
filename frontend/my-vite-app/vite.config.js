import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/react_test/',  // GitHub Pages의 레포지토리 이름으로 설정
    assetsInclude: ['**/*.css', '**/*.js']
})