#!/usr/bin/env node
/**
 * Servidor estático mínimo para E2E do SSG (.output/public).
 * - Diretórios → index.html; extensões servidas com content-type correto
 * - Rotas HTML sem arquivo → 200.html, como o fallback do hosting SSG Nuxt
 * - Assets ausentes continuam 404
 */
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.resolve(process.argv[2] || '.output/public')
const PORT = Number(process.env.PORT || 3001)
const HTML_ROUTES = new Set(
  fs
    .readdirSync(ROOT, { recursive: true })
    .filter((entry) => entry === 'index.html')
    .map((entry) => `/${path.dirname(entry).replaceAll(path.sep, '/')}`.replace(/\/$/, '') || '/'),
)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    let file = path.normalize(path.join(ROOT, url.pathname))
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end()
      return
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, 'index.html')
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      // Nuxt SSG em hosts estáticos devolve o app shell para rotas HTML;
      // não mascarar assets quebrados como JavaScript.
      if (!path.extname(url.pathname) && HTML_ROUTES.has(url.pathname.replace(/\/$/, '') || '/')) {
        file = path.join(ROOT, '200.html')
      } else if (!path.extname(url.pathname) && fs.existsSync(path.join(ROOT, '404.html'))) {
        // Comportamento de hosting estático (Hostinger): rota HTML desconhecida
        // serve a página de erro 404 com status 404
        res.writeHead(404, { 'content-type': MIME['.html'] })
        fs.createReadStream(path.join(ROOT, '404.html')).pipe(res)
        return
      }
      if (!fs.existsSync(file)) {
        res.writeHead(404, { 'content-type': 'text/plain' })
        res.end('not found')
        return
      }
    }
    const type = MIME[path.extname(file)] || 'application/octet-stream'
    res.writeHead(200, { 'content-type': type })
    fs.createReadStream(file).pipe(res)
  } catch {
    res.writeHead(500).end()
  }
})

server.listen(PORT, () => {
  process.stdout.write(`static server: ${ROOT} on http://localhost:${PORT}\n`)
})
