import cityssmConfig, { tseslint } from 'eslint-config-cityssm';
export const config = tseslint.config(...cityssmConfig, {
    rules: {
        '@typescript-eslint/no-magic-numbers': 'off'
    }
});
export default config;
