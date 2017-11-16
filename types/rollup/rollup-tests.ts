import { rollup, Bundle, Plugin } from 'rollup'

let console: any

let cache: Bundle | undefined
let plugin: Plugin

async function main() {
    const bundle = await rollup({
        input: 'main.js',
        external: ['external-module'],
        plugins: [plugin],
        onwarn: ({ code, frame, loc, message }) => {
            if (loc) {
                const { file, line, column } = loc
                console.log(`[${code}] - ${file}(${line},${column}): ${message}`)
            } else {
                console.log(`[${code}] - ${message}`)
            }

            if (frame) console.warn(frame)
        },
        cache,
    })

    const bundle2 = await rollup({
        input: 'main.js',
        external: id => /^rxjs/.test(id),
        plugins: plugin
    })

    const result = bundle.generate({
        format: 'cjs',
        indent: false,
        sourcemap: true,
    })

    cache = bundle

    await bundle.write({
        format: 'cjs',
        file: 'bundle.js',
        name: 'myLib',
        interop: false,
        globals: {
            jquery: '$',
            lodash: '_',
        },
        banner: '/* Banner */',
        footer: '/* Footer */',
        intro: 'var ENV = "production";',
        outro: 'var VERSION = "1.0.0";',
        indent: '  ',
        sourcemap: 'inline',
        sourcemapFile: 'bundle.js.map',
        strict: true,
    })
}

main()
