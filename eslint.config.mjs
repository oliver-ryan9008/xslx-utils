// @ts-check
import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

const rules = {
  '@typescript-eslint/no-require-imports': 0,
  '@typescript-eslint/no-explicit-any': 1,
  '@typescript-eslint/no-unsafe-assignment': 0,
  '@typescript-eslint/no-unsafe-call': 0,
  '@typescript-eslint/no-unsafe-member-access': 0,
  '@typescript-eslint/no-unsafe-argument': 0,
  '@typescript-eslint/no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }],
  'no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }],
}

export default [
  { files: ['src/**/*.{mjs,js,ts}'] },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  { rules },
]
