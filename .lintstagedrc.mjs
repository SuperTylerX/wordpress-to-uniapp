import { ESLint } from 'eslint'

// https://github.com/okonet/lint-staged#eslint--7-1
const removeIgnoredFiles = async files => {
  const eslint = new ESLint()
  const isIgnored = await Promise.all(
    files.map(file => {
      return eslint.isPathIgnored(file)
    })
  )
  const filteredFiles = files.filter((_, i) => !isIgnored[i])
  return filteredFiles.join(' ')
}

export default {
  '*.{js,ts,jsx,tsx,vue}': async files => {
    const filesToLint = await removeIgnoredFiles(files)
    return [
      `cross-env NODE_ENV=production eslint --fix --max-warnings=0 ${filesToLint}`,
      filesToLint.length === 0 ? undefined : `prettier --write ${filesToLint}`
    ].filter(Boolean)
  }
}
