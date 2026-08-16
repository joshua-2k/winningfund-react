import { createElement } from 'react'
import RouteHeroMagneticScroll from '../components/RouteHeroMagneticScroll.js'
import { RouteHeroTitle } from '../components/RouteHeroEffects.js'

const archiveTags = Object.freeze([
  'COMPANY ANALYSIS',
  'INVESTMENT STRATEGY',
  'TEAM REPORT',
  'INDIVIDUAL REPORT',
])

export default function ResearchPage() {
  return createElement(
    'main',
    {
      className: 'wf-research',
    },

    createElement(RouteHeroMagneticScroll, {
      heroSelector: '.wf-research-hero',
      nextSelector: '.wf-research-archive',
    }),

    createElement(
      'section',
      {
        className: 'wf-research-hero',
        'aria-labelledby': 'wf-research-title',
      },
      createElement(
        'div',
        {
          className: 'wf-research-hero__inner',
        },
        createElement(
          'p',
          {
            className: 'wf-research-hero__eyebrow',
          },
          'WINNINGFUND RESEARCH',
        ),
        createElement(RouteHeroTitle, {
          id: 'wf-research-title',
          className: 'wf-research-hero__title',
          title: 'RESEARCH',
        }),
        createElement(
          'div',
          {
            className: 'wf-research-hero__taxonomy',
            'aria-label': 'Research categories',
          },
          createElement(
            'span',
            null,
            'COMPANY ANALYSIS',
          ),
          createElement(
            'span',
            null,
            'INVESTMENT STRATEGY',
          ),
        ),
      ),
    ),

    createElement(
      'section',
      {
        className: 'wf-research-archive',
        'aria-labelledby': 'wf-research-archive-title',
      },
      createElement(
        'div',
        {
          className: 'wf-research-section__inner',
        },
        createElement(
          'header',
          {
            className: 'wf-research-archive__header',
          },
          createElement(
            'p',
            {
              className: 'wf-research-archive__eyebrow',
            },
            'SELECTED REPORTS',
          ),
          createElement(
            'h2',
            {
              id: 'wf-research-archive-title',
            },
            '우수 리포트 아카이브',
          ),
          createElement(
            'p',
            {
              className: 'wf-research-archive__copy',
            },
            '기업분석과 투자전략 활동을 통해 작성된 리포트 중 우수 리포트를 선정하여 공개합니다.',
          ),
        ),

        createElement(
          'article',
          {
            className: 'wf-research-coming-soon',
          },
          createElement(
            'div',
            {
              className: 'wf-research-coming-soon__meta',
            },
            createElement(
              'span',
              null,
              'ARCHIVE STATUS',
            ),
            createElement(
              'strong',
              null,
              'COMING SOON',
            ),
          ),
          createElement(
            'div',
            {
              className: 'wf-research-coming-soon__body',
            },
            createElement(
              'p',
              {
                className: 'wf-research-coming-soon__kicker',
              },
              'CURATED RESEARCH',
            ),
            createElement(
              'h3',
              null,
              '리포트 선정 후 순차적으로 공개됩니다.',
            ),
            createElement(
              'p',
              null,
              '우수 리포트 선정이 완료되면 기업분석 및 투자전략 리포트를 이곳에서 소개하고, 각 리포트는 위닝펀드 네이버 카페의 해당 게시글로 연결할 예정입니다.',
            ),
          ),
          createElement(
            'div',
            {
              className: 'wf-research-coming-soon__tags',
            },
            ...archiveTags.map((tag) =>
              createElement(
                'span',
                {
                  key: tag,
                },
                tag,
              ),
            ),
          ),
        ),
      ),
    ),
  )
}
