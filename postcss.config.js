module.exports = {
  plugins: [
    require('stylelint')(),
    require('postcss-easing-gradients'),
    require('postcss-focus-visible')(),
    require('postcss-preset-env')(),
    require('postcss-reporter')({ clearReportedMessages: true }),
  ],
}
