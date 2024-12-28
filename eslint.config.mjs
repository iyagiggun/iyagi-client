import globals from 'globals';
import js from '@eslint/js';


export default [
  js.configs.recommended,
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'object-curly-spacing': ['error', 'always'],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
      quotes: ['error', 'single'],
      'quote-props': ['error', 'as-needed'],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': ['error'],
      semi: ['error', 'always'],
      indent: ['error', 2, {
        SwitchCase: 1,
      }],
    },
  },

];
