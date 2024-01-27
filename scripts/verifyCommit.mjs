import fs from 'node:fs'
import chalk from 'chalk'

const msgPath = process.argv[2]
const msg = removeComment(fs.readFileSync(msgPath, 'utf-8').trim())

const test = r => r.test.bind(r)

const wildcards = [
  test(/^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m),
  test(/^(Merge tag (.*?))(?:\r?\n)*$/m),
  test(/^(R|r)evert (.*)/),
  test(/^(fixup|squash)!/),
  test(/^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/),
  test(/^Merge remote-tracking branch(\s*)(.*)/),
  test(/^Automatic merge(.*)/),
  test(/^Auto-merged (.*?) into (.*)/)
]

const commitRE =
  /^(revert: )?(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release|Merge)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg) && !isIgnored(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
      ) +
      `    ${chalk.green(`feat(request): add 'comments' option`)}\n` +
      `    ${chalk.green(`fix(module): handle events on blur (close #28)`)}\n\n` +
      chalk.red(`  See .github/commit-convention.md for more details.\n`)
  )
  process.exit(1)
}

function removeComment(msg) {
  return msg.replace(/^#.*[\n\r]*/gm, '')
}

/** 忽略自动合并的 commit */
function isIgnored(commit = '') {
  return wildcards.some(w => w(commit))
}
