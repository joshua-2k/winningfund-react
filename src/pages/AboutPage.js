import { createElement } from 'react'
import RouteResearchBookScroll from '../components/RouteResearchBookScroll.js'
import { RouteHeroTitle, RouteHeroWave } from '../components/RouteHeroEffects.js'
import {
  selectAboutPageData,
  siteContentBundle,
} from '../content/index.js'

const aboutData =
  selectAboutPageData(siteContentBundle)

function SectionIntro({
  index,
  eyebrow,
  title,
  copy,
  id,
}) {
  return createElement(
    'header',
    {
      className: 'wf-about-section-head',
    },
    createElement(
      'div',
      {
        className: 'wf-about-section-head__meta',
      },
      createElement(
        'span',
        {
          className: 'wf-about-section-head__index',
          'aria-hidden': 'true',
        },
        index,
      ),
      createElement(
        'span',
        {
          className: 'wf-about-section-head__eyebrow',
        },
        eyebrow,
      ),
    ),
    createElement(
      'h2',
      {
        id,
        className: 'wf-about-section-head__title',
      },
      title,
    ),
    copy
      ? createElement(
          'p',
          {
            className: 'wf-about-section-head__copy',
          },
          copy,
        )
      : null,
  )
}

function OrganizationChart({ record }) {
  const nodes = [...(record?.nodes ?? [])].sort(
    (a, b) => a.order - b.order,
  )

  const leaders = nodes.filter(
    (node) => node.tier === 'LEADERSHIP',
  )

  const officers = nodes.filter(
    (node) => node.tier === 'OFFICER',
  )

  return createElement(
    'div',
    {
      className: 'wf-about-org',
    },

    createElement(
      'ol',
      {
        className: 'wf-about-org__leaders',
        'aria-label': '위닝펀드 운영진',
      },
      ...leaders.map((node) =>
        createElement(
          'li',
          {
            key: node.id,
            className: 'wf-about-org__leader',
          },
          createElement(
            'span',
            {
              className: 'wf-about-org__leader-label',
            },
            node.role,
          ),
          createElement(
            'p',
            null,
            node.description,
          ),
        ),
      ),
    ),

    createElement(
      'div',
      {
        className: 'wf-about-org__branch',
        'aria-hidden': 'true',
      },
    ),

    createElement(
      'ul',
      {
        className: 'wf-about-org__officers',
      },
      ...officers.map((node) =>
        createElement(
          'li',
          {
            key: node.id,
            className: 'wf-about-org__officer',
          },
          createElement(
            'h3',
            null,
            node.role,
          ),
          createElement(
            'p',
            null,
            node.description,
          ),
        ),
      ),
    ),

    record?.note
      ? createElement(
          'p',
          {
            className: 'wf-about-org__note',
          },
          record.note,
        )
      : null,
  )
}

function ExternalActivityList({ record }) {
  return createElement(
    'ol',
    {
      className: 'wf-about-external__list',
    },
    ...(record?.items ?? []).map((item, index) =>
      createElement(
        'li',
        {
          key: item.id,
          className: 'wf-about-external__item',
        },
        createElement(
          'span',
          {
            className: 'wf-about-external__number',
            'aria-hidden': 'true',
          },
          String(index + 1).padStart(2, '0'),
        ),
        createElement(
          'strong',
          {
            className: 'wf-about-external__label',
          },
          item.label,
        ),
        createElement(
          'p',
          {
            className: 'wf-about-external__description',
          },
          item.description,
        ),
      ),
    ),
  )
}

function SocialBrandIcon({ id }) {
  if (id === 'instagram') {
    return createElement(
      'svg',
      {
        className:
          'wf-about-social__brand-svg wf-about-social__brand-svg--instagram',
        viewBox: '0 0 48 48',
        focusable: 'false',
        'aria-hidden': 'true',
      },
      createElement(
        'defs',
        null,
        createElement(
          'linearGradient',
          {
            id: 'wf-instagram-gradient',
            x1: '0%',
            y1: '100%',
            x2: '100%',
            y2: '0%',
          },
          createElement('stop', {
            offset: '0%',
            stopColor: '#feda75',
          }),
          createElement('stop', {
            offset: '28%',
            stopColor: '#fa7e1e',
          }),
          createElement('stop', {
            offset: '55%',
            stopColor: '#d62976',
          }),
          createElement('stop', {
            offset: '78%',
            stopColor: '#962fbf',
          }),
          createElement('stop', {
            offset: '100%',
            stopColor: '#4f5bd5',
          }),
        ),
      ),
      createElement('rect', {
        x: 3,
        y: 3,
        width: 42,
        height: 42,
        rx: 12,
        fill: 'url(#wf-instagram-gradient)',
      }),
      createElement('rect', {
        x: 13,
        y: 13,
        width: 22,
        height: 22,
        rx: 7,
        fill: 'none',
        stroke: '#ffffff',
        strokeWidth: 3,
      }),
      createElement('circle', {
        cx: 24,
        cy: 24,
        r: 5.5,
        fill: 'none',
        stroke: '#ffffff',
        strokeWidth: 3,
      }),
      createElement('circle', {
        cx: 32.5,
        cy: 15.5,
        r: 1.9,
        fill: '#ffffff',
      }),
    )
  }

  if (id === 'naver-cafe') {
    return createElement(
      'svg',
      {
        className:
          'wf-about-social__brand-svg wf-about-social__brand-svg--naver-cafe',
        viewBox: '0 0 48 48',
        focusable: 'false',
        'aria-hidden': 'true',
      },
      createElement('rect', {
        x: 3,
        y: 3,
        width: 42,
        height: 42,
        rx: 12,
        fill: '#ffffff',
        stroke: 'rgba(10, 23, 48, 0.08)',
      }),
      createElement('path', {
        d: 'M11.5 18.5h22v8.3c0 7.2-4.9 12.2-11 12.2s-11-5-11-12.2z',
        fill: '#03c75a',
      }),
      createElement('path', {
        d: 'M33.5 21h2.2a5.2 5.2 0 0 1 0 10.4h-3.1',
        fill: 'none',
        stroke: '#03c75a',
        strokeWidth: 3.2,
        strokeLinecap: 'round',
      }),
      createElement('path', {
        d: 'M26.7 16.2c.2-4.8 4-7.7 9-7.8-.1 4.8-3.7 7.6-9 7.8z',
        fill: '#03c75a',
      }),
    )
  }

  return createElement(
    'span',
    {
      className: 'wf-about-social__brand-fallback',
      'aria-hidden': 'true',
    },
    'W',
  )
}

function SocialLinks({ record }) {
  return createElement(
    'div',
    {
      className: 'wf-about-social__grid',
    },
    ...(record?.items ?? []).map((item, index) =>
      createElement(
        'a',
        {
          key: item.id,
          className: 'wf-about-social__link',
          href: item.url,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        createElement(
          'span',
          {
            className: 'wf-about-social__brand',
            'aria-hidden': 'true',
          },
          createElement(SocialBrandIcon, {
            id: item.id,
          }),
        ),
        createElement(
          'span',
          {
            className: 'wf-about-social__label',
          },
          item.label,
        ),
        createElement(
          'span',
          {
            className: 'wf-about-social__handle',
          },
          item.handle,
        ),
        createElement(
          'span',
          {
            className: 'wf-about-social__arrow',
            'aria-hidden': 'true',
          },
          '↗',
        ),
      ),
    ),
  )
}

export default function AboutPage() {
  const {
    aboutContent,
    organization,
    externalActivities,
    socialLinks,
  } = aboutData

  const hero = aboutContent?.hero ?? {}

  return createElement(
    'main',
    {
      className: 'wf-about',
    },
    createElement(RouteResearchBookScroll, {
      rootSelector: '.wf-about',
      sections: [
      {
        selector: '.wf-about-hero',
        label: 'ABOUT',
      },
      {
        selector: '.wf-about-section--intro',
        label: 'INTRO',
      },
      {
        selector: '.wf-about-section--external',
        label: 'NETWORK',
      },
      {
        selector: '.wf-about-section--social',
        label: 'SNS',
      },
      ],
    }),
createElement(
      'section',
      {
        className: 'wf-about-hero',
        'aria-labelledby': 'wf-about-title',
      },

      createElement(
        'div',
        {
          className: 'wf-about-hero__inner',
        },

        createElement(
          'p',
          {
            className: 'wf-about-hero__eyebrow',
          },
          hero.eyebrow ?? 'WINNINGFUND',
        ),

        createElement(RouteHeroTitle, {
          id: 'wf-about-title',
          className: 'wf-about-hero__title',
          title: hero.title ?? 'ABOUT',
        }),

        createElement(
          'p',
          {
            className: 'wf-about-hero__summary',
          },
          hero.summary,
        ),

        createElement(
          'dl',
          {
            className: 'wf-about-hero__facts',
          },
          ...(aboutContent?.facts ?? []).map((fact) =>
            createElement(
              'div',
              {
                key: fact.id,
                className: 'wf-about-hero__fact',
              },
              createElement(
                'dt',
                null,
                fact.label,
              ),
              createElement(
                'dd',
                null,
                fact.value,
              ),
            ),
          ),
        ),
      ),

      createElement(RouteHeroWave, { waveId: 'wf-about-route-wave', surface: 'soft' }),
    ),

    createElement(
      'section',
      {
        className:
          'wf-about-section wf-about-section--intro',
        'aria-labelledby': 'wf-about-introduction-title',
      },
      createElement(
        'div',
        {
          className: 'wf-about-section__inner',
        },

        createElement(SectionIntro, {
          index: '01',
          eyebrow: 'INTRODUCTION',
          title:
            aboutContent?.introductionTitle ??
            'Introduction',
          copy: aboutContent?.detailedIntroduction,
          id: 'wf-about-introduction-title',
        }),

        createElement(
          'div',
          {
            className: 'wf-about-org-heading',
          },
          createElement(
            'span',
            null,
            'ORGANIZATION',
          ),
          createElement(
            'strong',
            null,
            '운영 조직',
          ),
        ),

        createElement(OrganizationChart, {
          record: organization,
        }),
      ),
    ),

    createElement(
      'section',
      {
        className:
          'wf-about-section wf-about-section--external',
        'aria-labelledby': 'wf-about-external-title',
      },
      createElement(
        'div',
        {
          className: 'wf-about-section__inner',
        },

        createElement(SectionIntro, {
          index: '02',
          eyebrow: 'NETWORK',
          title:
            externalActivities?.title ??
            '외부 활동 & 연계',
          copy: externalActivities?.introduction,
          id: 'wf-about-external-title',
        }),

        createElement(ExternalActivityList, {
          record: externalActivities,
        }),
      ),
    ),

    createElement(
      'section',
      {
        className:
          'wf-about-section wf-about-section--social',
        'aria-labelledby': 'wf-about-social-title',
      },
      createElement(
        'div',
        {
          className: 'wf-about-section__inner',
        },

        createElement(SectionIntro, {
          index: '03',
          eyebrow: 'CONNECT',
          title:
            socialLinks?.title ??
            'SNS',
          copy: socialLinks?.introduction,
          id: 'wf-about-social-title',
        }),

        createElement(SocialLinks, {
          record: socialLinks,
        }),
      ),
    ),
  )
}