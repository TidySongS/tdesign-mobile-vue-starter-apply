import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: false,
  },
  rules: {
    'no-console': 'off',
  },
  ignores: [
    'public/mockServiceWorker.js',
  ],
})
