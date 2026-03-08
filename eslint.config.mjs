export default [
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly', document: 'readonly', localStorage: 'readonly',
        requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly',
        AudioContext: 'readonly', console: 'readonly', confirm: 'readonly',
        URL: 'readonly', Blob: 'readonly', FileReader: 'readonly',
        navigator: 'readonly', crypto: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
];
