import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import eslintPrettier from 'eslint-config-prettier' // 新增

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'no-console': 'warn',
      'react/jsx-uses-react': 'off', // 关闭 React 相关规则
      '@typescript-eslint/no-explicit-any': 'off' // 关闭 any 类型检查
    }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPrettier // 新增
]
