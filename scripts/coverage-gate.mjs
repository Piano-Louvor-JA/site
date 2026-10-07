#!/usr/bin/env node
/**
 * Coverage gate 100x4 (unit + integration sequencial).
 * - Unit: vitest run --coverage (thresholds 100 do vitest.config).
 * - Integration: cada spec roda ISOLADA — @nuxt/test-utils sobe um servidor
 *   Nuxt por spec; paralelo/contiguo no mesmo processo conflita porta/build.
 */
import { execSync } from 'node:child_process'
import { readdirSync } from 'node:fs'

const run = (cmd) => {
  console.log(`\n$ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, CI: 'true' } })
}

run('pnpm vitest run --project unit --coverage')

const specs = readdirSync('test/integration').filter((f) => f.endsWith('.spec.ts'))
for (const spec of specs) {
  run(`pnpm vitest run --project integration test/integration/${spec}`)
}

console.log('\n✅ coverage gate 100x4 OK (unit + integration)')
