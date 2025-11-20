import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
   baseDirectory: __dirname,
   recommendedConfig: js.configs.recommended,
   allConfig: js.configs.all,
});

export default defineConfig([
   {
      languageOptions: {
         globals: {
            ...globals.browser,
         },

         parser: tsParser,
      },

      extends: compat.extends(
         'eslint:recommended',
         'plugin:react/recommended',
         'plugin:@typescript-eslint/recommended',
         'prettier'
      ),

      plugins: {
         react,
         '@typescript-eslint': typescriptEslint,
      },

      rules: {
         'no-unused-vars': 'warn',
         'react/prop-types': 'off',
      },
   },
]);
