/**
 * Created by yitala on 2018/3/27.
 */
module.exports = {
    parser: 'postcss-safe-parser',
    plugins: {
        autoprefixer: {
            browsers: [
                'last 2 versions',
                'iOS >= 8'
            ]
        }
    }

}