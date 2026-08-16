import fs from 'node:fs'
import path from 'node:path'
import {
  absoluteUrl,
  buildStructuredData,
  SEO_ROUTES,
  SITE_IDENTITY,
} from '../src/seo/seoConfig.js'

const projectRoot =
  process.cwd()

const distDir =
  path.join(
    projectRoot,
    'dist',
  )

const indexPath =
  path.join(
    distDir,
    'index.html',
  )

if (!fs.existsSync(indexPath)) {
  throw new Error(
    'dist/index.html does not exist. Run vite build first.',
  )
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

function replaceTitle(
  html,
  value,
) {
  const replacement =
    `<title>${escapeHtml(value)}</title>`

  if (
    /<title>[\s\S]*?<\/title>/i
      .test(html)
  ) {
    return html.replace(
      /<title>[\s\S]*?<\/title>/i,
      replacement,
    )
  }

  return html.replace(
    '</head>',
    `  ${replacement}\n  </head>`,
  )
}

function upsertMeta(
  html,
  {
    attr,
    key,
    content,
  },
) {
  const regex =
    new RegExp(
      `<meta\\s+[^>]*${attr}=["']${key}["'][^>]*>`,
      'i',
    )

  const tag =
    `<meta ${attr}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`

  if (regex.test(html)) {
    return html.replace(
      regex,
      tag,
    )
  }

  return html.replace(
    '</head>',
    `  ${tag}\n  </head>`,
  )
}

function upsertCanonical(
  html,
  href,
) {
  const regex =
    /<link\s+[^>]*rel=["']canonical["'][^>]*>/i

  const tag =
    `<link rel="canonical" href="${escapeHtml(href)}" />`

  if (regex.test(html)) {
    return html.replace(
      regex,
      tag,
    )
  }

  return html.replace(
    '</head>',
    `  ${tag}\n  </head>`,
  )
}

function upsertJsonLd(
  html,
  value,
) {
  const json =
    JSON.stringify(value)

  const regex =
    /<script\s+id=["']wf-seo-structured-data["'][^>]*>[\s\S]*?<\/script>/i

  const tag =
    `<script id="wf-seo-structured-data" type="application/ld+json">${json}</script>`

  if (regex.test(html)) {
    return html.replace(
      regex,
      tag,
    )
  }

  return html.replace(
    '</head>',
    `  ${tag}\n  </head>`,
  )
}

function applySeo(
  html,
  entry,
) {
  const canonical =
    absoluteUrl(
      entry.canonicalPath,
    )

  let next =
    replaceTitle(
      html,
      entry.title,
    )

  next =
    upsertMeta(
      next,
      {
        attr: 'name',
        key: 'description',
        content:
          entry.description,
      },
    )

  next =
    upsertMeta(
      next,
      {
        attr: 'name',
        key: 'robots',
        content:
          'index, follow, max-image-preview:large',
      },
    )

  next =
    upsertCanonical(
      next,
      canonical,
    )

  for (
    const [
      property,
      content,
    ]
    of [
      ['og:type', 'website'],
      ['og:locale', 'ko_KR'],
      [
        'og:site_name',
        SITE_IDENTITY.siteName,
      ],
      ['og:title', entry.title],
      [
        'og:description',
        entry.description,
      ],
      ['og:url', canonical],
    ]
  ) {
    next =
      upsertMeta(
        next,
        {
          attr: 'property',
          key: property,
          content,
        },
      )
  }

  for (
    const [
      name,
      content,
    ]
    of [
      ['twitter:card', 'summary'],
      ['twitter:title', entry.title],
      [
        'twitter:description',
        entry.description,
      ],
    ]
  ) {
    next =
      upsertMeta(
        next,
        {
          attr: 'name',
          key: name,
          content,
        },
      )
  }

  next =
    upsertJsonLd(
      next,
      buildStructuredData(entry),
    )

  return next
}

const builtIndex =
  fs.readFileSync(
    indexPath,
    'utf8',
  )

for (const entry of SEO_ROUTES) {
  const html =
    applySeo(
      builtIndex,
      entry,
    )

  if (entry.path === '/') {
    fs.writeFileSync(
      indexPath,
      html,
      'utf8',
    )

    continue
  }

  const routeName =
    entry.path
      .replace(/^\/+|\/+$/g, '')

  const routeDir =
    path.join(
      distDir,
      routeName,
    )

  fs.mkdirSync(
    routeDir,
    {
      recursive: true,
    },
  )

  fs.writeFileSync(
    path.join(
      routeDir,
      'index.html',
    ),
    html,
    'utf8',
  )
}

console.log(
  `Generated SEO entry HTML for ${SEO_ROUTES.length} routes.`,
)
console.log(
  'Direct routes now have static 200 entry documents.',
)
