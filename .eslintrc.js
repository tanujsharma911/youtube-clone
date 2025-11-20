export default {
   env: {
      browser: true,
      es2021: true,
   },
   extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
   ],
   parser: '@typescript-eslint/parser',
   plugins: ['react', '@typescript-eslint'],
   rules: {
      'no-unused-vars': 'warn',
      'react/prop-types': 'off',

      // Require semicolons
      'semi': 'off', // disable base rule to avoid conflict
      '@typescript-eslint/semi': ['error', 'always'],
   },
};
