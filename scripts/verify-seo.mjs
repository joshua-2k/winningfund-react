import fs from 'node:fs'
import path from 'node:path'
import {
  absoluteUrl,
  SEO_ROUTES,
} from '../src/seo/seoConfig.js'

const root =
  process.cwd()

const dist =
  path.join(
    root,
    'dist',
  )

function assert(
  condition,
  message,
) {
  if (!condition) {
    console.error(
      `FAIL: ${message}`,
    )

    process.exitCode = 1
    return
  }

  console.log(
    `PASS: ${message}`,
  )
}

for (const entry of SEO_ROUTES) {
  const routeName =
    entry.path === '/'
      ? ''
      : entry.path
          .replace(
            /^\/+|\/+$/g,
            '',
          )

  const file =
    routeName
      ? path.join(
          dist,
          routeName,
          'index.html',
        )
      : path.join(
          dist,
          'index.html',
        )

  assert(
    fs.existsSync(file),
    `static entry exists: ${entry.path}`,
  )

  if (!fs.existsSync(file)) {
    continue
  }

  const html =
    fs.readFileSync(
      file,
      'utf8',
    )

  assert(
    html.includes(
      `<title>${entry.title}</title>`,
    ),
    `unique title: ${entry.path}`,
  )

  assert(
    html.includes(
      `href="${absoluteUrl(entry.canonicalPath)}"`,
    ),
    `canonical: ${entry.path}`,
  )

  assert(
    html.includes(
      'name="description"',
    ),
    `description meta: ${entry.path}`,
  )

  assert(
    html.includes(
      'property="og:title"',
    ),
    `Open Graph: ${entry.path}`,
  )

  assert(
    html.includes(
      'id="wf-seo-structured-data"',
    ),
    `JSON-LD: ${entry.path}`,
  )

  assert(
    !html.includes(
      '/winningfund-react/',
    ),
    `no legacy repository base: ${entry.path}`,
  )
}

const robots =
  path.join(
    dist,
    'robots.txt',
  )

const sitemap =
  path.join(
    dist,
    'sitemap.xml',
  )

assert(
  fs.existsSync(robots),
  'robots.txt copied to dist',
)

assert(
  fs.existsSync(sitemap),
  'sitemap.xml copied to dist',
)

if (fs.existsSync(robots)) {
  const text =
    fs.readFileSync(
      robots,
      'utf8',
    )

  assert(
    text.includes(
      'https://winningfund.kr/sitemap.xml',
    ),
    'robots.txt references sitemap',
  )
}

if (fs.existsSync(sitemap)) {
  const text =
    fs.readFileSync(
      sitemap,
      'utf8',
    )

  for (const entry of SEO_ROUTES) {
    assert(
      text.includes(
        absoluteUrl(
          entry.canonicalPath,
        ),
      ),
      `sitemap URL: ${entry.canonicalPath}`,
    )
  }
}

if (process.exitCode) {
  console.error(
    '\nSEO verification FAILED.',
  )
}
else {
  console.log(
    '\nSEO verification PASSED.',
  )
}
