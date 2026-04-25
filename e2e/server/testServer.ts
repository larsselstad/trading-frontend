import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { join } from 'node:path'

const FIXTURES_DIR = join(import.meta.dirname, '../fixtures')
const PORT = 8002

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json')

  // Stub write endpoints — just acknowledge without persisting
  if (req.method === 'PUT' || req.method === 'POST') {
    res.writeHead(200)
    res.end(JSON.stringify({ success: true }))
    console.log(`  ${req.method} ${url.pathname} → stubbed`)
    return
  }

  try {
    let fixtureName: string

    if (url.pathname === '/resources') {
      fixtureName = 'resources'
    } else if (url.pathname === '/experiments') {
      fixtureName = 'experiments'
    } else if (/^\/experiments\/[^/]+\/stock-data$/.test(url.pathname)) {
      fixtureName = 'experiment-stock-data'
    } else if (
      /^\/experiments\/[^/]+\/charts\/[^/]+\/data$/.test(url.pathname)
    ) {
      fixtureName = 'experiment-chart-data'
    } else if (/^\/experiments\/[^/]+$/.test(url.pathname)) {
      fixtureName = 'experiment-detail'
    } else if (url.pathname === '/data' || url.pathname === '/plot') {
      fixtureName = url.searchParams.get('filename') ?? 'line-only'
    } else {
      res.writeHead(404)
      res.end(
        JSON.stringify({
          success: false,
          error: `Unknown endpoint: ${url.pathname}`,
        }),
      )
      return
    }

    const fixturePath = join(FIXTURES_DIR, `${fixtureName}.json`)
    const data = readFileSync(fixturePath, 'utf-8')
    res.writeHead(200)
    res.end(data)
    console.log(
      `  ${req.method} ${url.pathname}${url.search} → ${fixtureName}.json`,
    )
  } catch (err) {
    console.error(`  Error serving ${url.pathname}:`, err)
    res.writeHead(500)
    res.end(JSON.stringify({ success: false, error: 'Fixture not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`)
  console.log(
    'Available fixtures: resources, experiments, experiment-detail, experiment-stock-data, experiment-chart-data, line-only, with-ohlc, with-predictions',
  )
})
