import {defineConfig} from 'umi';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    ...!isProduction && {
        proxy: {
            '/api': {
                target: 'https://blackjack.fuzz.me.uk/',
                changeOrigin: true,
                'pathRewrite': { '^/api' : '' },
            }
        }
    }
});
