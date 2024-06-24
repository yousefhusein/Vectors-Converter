import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'unicorn/prefer-node-protocol': 'off',
    'no-unused-vars': 'off',
  },
})
