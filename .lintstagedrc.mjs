export default {
  '*.{ts,js,svelte}': ['prettier --write', 'eslint --fix'],
  '*.{json,html,css,md}': ['prettier --write'],
}
