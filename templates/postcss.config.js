module.exports = {
    parser: 'postcss-safe-parser',
    plugins: {
        'postcss-import': {},
        'postcss-cssnext': {},
        'cssnano': {},
        'postcss-write-svg':{
            utf8: false
        },
        'postcss-px-to-viewport': {
            viewportWidth: 750,
            viewportHeight: 1334,
            unitPrecision: 5,
            viewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false
        },
        "postcss-viewport-units":{}
    }
}