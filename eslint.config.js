import antfu from '@antfu/eslint-config'

export default antfu({
    vue: true,
    typescript: true,
    stylistic: {
        indent: 4,
        quotes: 'single',
    },
    rules: {
        'no-console': 'off',
    },
})
