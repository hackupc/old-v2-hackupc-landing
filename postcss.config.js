module.exports = {
  plugins: [
    require('postcss-easing-gradients'),
    require('postcss-preset-env')(),
    require('cssnano')(),
  ],
};
