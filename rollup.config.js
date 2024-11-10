import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js',
            format: 'es',
            exports: 'named',
            sourcemap: true,
        },
    ],
    plugins: [
        postcss({
            modules: true,
            extract: false,
        }),
        typescript({
            tsconfig: './tsconfig.json',
        }),
    ],
    external: ['react', 'react-dom'],
}
