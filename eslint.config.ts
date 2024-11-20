import cityssmConfig, { cspellWords, tseslint } from 'eslint-config-cityssm'

export const config = tseslint.config(...cityssmConfig, {
  rules: {
    '@cspell/spellchecker': [
      'warn',
      {
        cspell: {
          words: [...cspellWords, 'master']
        }
      }
    ],
    '@typescript-eslint/no-magic-numbers': 'off'
  }
})

export default config