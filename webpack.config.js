const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_URL = "./src/client/js/";

module.exports = {
  entry: {
    main: BASE_URL + "main.js",
    videoPlayer: BASE_URL + "videoPlayer.js",
    videoRecording: BASE_URL + "videoRecording.js",
    videoComments: BASE_URL + "videoComments.js",
    header: BASE_URL + "header.js",
    errorMsg: BASE_URL + "errorMsg.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
