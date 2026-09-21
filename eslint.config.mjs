// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // CLAUDE.local.md: tipagem rigorosa, nunca usar `any`.
    '@typescript-eslint/no-explicit-any': 'error',
  },
})

