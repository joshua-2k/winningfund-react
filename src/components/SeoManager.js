import {
  createElement,
  useEffect,
} from 'react'
import { useLocation } from 'react-router'
import {
  absoluteUrl,
  buildStructuredData,
  resolveSeo,
  SITE_IDENTITY,
} from '../seo/seoConfig.js'

function upsertMeta({
  selector,
  attributes,
}) {
  let element =
    document.head.querySelector(selector)

  if (!element) {
    element =
      document.createElement('meta')

    document.head.appendChild(element)
  }

  Object.entries(attributes)
    .forEach(
      ([name, value]) => {
        element.setAttribute(
          name,
          value,
        )
      },
    )
}

function upsertCanonical(href) {
  let canonical =
    document.head.querySelector(
      'link[rel="canonical"]',
    )

  if (!canonical) {
    canonical =
      document.createElement('link')

    canonical.setAttribute(
      'rel',
      'canonical',
    )

    document.head.appendChild(
      canonical,
    )
  }

  canonical.setAttribute(
    'href',
    href,
  )
}

function upsertJsonLd(data) {
  const id =
    'wf-seo-structured-data'

  let script =
    document.head.querySelector(
      `#${id}`,
    )

  if (!script) {
    script =
      document.createElement('script')

    script.id = id
    script.type =
      'application/ld+json'

    document.head.appendChild(
      script,
    )
  }

  script.textContent =
    JSON.stringify(data)
}

export default function SeoManager() {
  const location =
    useLocation()

  useEffect(
    () => {
      const seo =
        resolveSeo(location.pathname)

      const canonical =
        absoluteUrl(
          seo.canonicalPath,
        )

      document.documentElement.lang =
        'ko'

      document.title =
        seo.title

      upsertMeta({
        selector:
          'meta[name="description"]',
        attributes: {
          name: 'description',
          content:
            seo.description,
        },
      })

      upsertMeta({
        selector:
          'meta[name="robots"]',
        attributes: {
          name: 'robots',
          content:
            'index, follow, max-image-preview:large',
        },
      })

      upsertCanonical(canonical)

      upsertMeta({
        selector:
          'meta[property="og:type"]',
        attributes: {
          property: 'og:type',
          content: 'website',
        },
      })

      upsertMeta({
        selector:
          'meta[property="og:locale"]',
        attributes: {
          property: 'og:locale',
          content: 'ko_KR',
        },
      })

      upsertMeta({
        selector:
          'meta[property="og:site_name"]',
        attributes: {
          property: 'og:site_name',
          content:
            SITE_IDENTITY.siteName,
        },
      })

      upsertMeta({
        selector:
          'meta[property="og:title"]',
        attributes: {
          property: 'og:title',
          content: seo.title,
        },
      })

      upsertMeta({
        selector:
          'meta[property="og:description"]',
        attributes: {
          property:
            'og:description',
          content:
            seo.description,
        },
      })

      upsertMeta({
        selector:
          'meta[property="og:url"]',
        attributes: {
          property: 'og:url',
          content: canonical,
        },
      })

      upsertMeta({
        selector:
          'meta[name="twitter:card"]',
        attributes: {
          name: 'twitter:card',
          content: 'summary',
        },
      })

      upsertMeta({
        selector:
          'meta[name="twitter:title"]',
        attributes: {
          name: 'twitter:title',
          content: seo.title,
        },
      })

      upsertMeta({
        selector:
          'meta[name="twitter:description"]',
        attributes: {
          name: 'twitter:description',
          content:
            seo.description,
        },
      })

      upsertJsonLd(
        buildStructuredData(seo),
      )
    },
    [location.pathname],
  )

  return createElement(
    'span',
    {
      hidden: true,
      'aria-hidden': 'true',
      'data-wf-seo-manager': 'active',
    },
  )
}
