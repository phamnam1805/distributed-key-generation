const path = require("path");
// https://webpack.js.org/configuration/resolve/#resolvefallback
module.exports = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            stream: require.resolve("stream-browserify"),
            crypto: require.resolve("crypto-browserify"),
            assert: require.resolve("assert"),
        },
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
};
