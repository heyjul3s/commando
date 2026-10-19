export default {
  cache: true,
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-alphabetical-order',
  ],
  plugins: [
    'stylelint-selector-bem-pattern',
    'stylelint-no-unsupported-browser-features',
    'stylelint-plugin-defensive-css',
    'stylelint-order',
  ],
  rules: {
    'at-rule-no-unknown': null,
    'custom-property-pattern': null,
    'declaration-empty-line-before': null,
    'no-empty-source': null,
    'number-max-precision': 3,
    'selector-class-pattern': null,
    'plugin/selector-bem-pattern': {
      componentName: '^[a-z]+(?:-[a-z]+)*$',
      componentSelectors: {
        initial: '^\\.[a-z]+(?:-[a-z]+)*(?:__[a-z]+(?:-[a-z]+)*)?(?:--[a-z]+(?:-[a-z]+)*)?$',
      },
      preset: 'bem',
    },
    'plugin/no-unsupported-browser-features': [true, { severity: 'warning' }],
    'property-no-vendor-prefix': null,
  },
};
