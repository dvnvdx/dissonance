import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended']
	},
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.node }
	},
	tseslint.configs.recommended,
	eslintPrettierRecommended
]);
