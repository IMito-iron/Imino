import { readFileSync } from 'node:fs'

const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'))
const urls = new Set()

for (const pkg of Object.values(lock.packages || {})) {
  if (pkg?.resolved?.startsWith('http')) {
    urls.add(pkg.resolved)
  }
}

console.log([...urls].sort().join('\n'))
