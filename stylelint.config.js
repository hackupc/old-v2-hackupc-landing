/**
 * @type {import("stylelint").Configuration}
 */
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-sass-guidelines',
    'stylelint-config-idiomatic-order',
    'stylelint-config-prettier',
  ],

  plugins: ['stylelint-order', 'stylelint-scss'],

  rules: {
    'block-no-empty': null,
    'max-nesting-depth': null,
    'selector-max-compound-selectors': null, // TODO: set to 3
    'order/properties-alphabetical-order': null,
    'selector-class-pattern': [
      '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
      {
        message: 'Class names must follow BEM convention',
      },
    ],
    'declaration-block-no-duplicate-properties': true,
  },
}
