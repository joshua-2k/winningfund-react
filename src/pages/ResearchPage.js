import { createElement } from 'react'
import RouteResearchBookScroll from '../components/RouteResearchBookScroll.js'
import { RouteHeroTitle } from '../components/RouteHeroEffects.js'

const researchArchiveLinks = Object.freeze({
  individual:
    'https://cafe.naver.com/f-e/cafes/26340278/menus/507?viewType=L',
  team:
    'https://cafe.naver.com/f-e/cafes/26340278/menus/508',
})

const archiveGroups = Object.freeze([
  {
    id: 'individual',
    index: '01',
    label: 'INDIVIDUAL REPORT',
    title: '개인 리포트',
    description:
      '역대 위닝펀드 회원들이 작성한 우수 개인 리포트를 모아둔 네이버 카페 아카이브입니다.',
  },
  {
    id: 'team',
    index: '02',
    label: 'TEAM REPORT',
    title: '팀 리포트',
    description:
      '역대 위닝펀드 팀 활동을 통해 작성된 우수 팀 리포트를 모아둔 네이버 카페 아카이브입니다.',
  },
])

function ArchiveGateway({
  group,
}) {
  const url =
    researchArchiveLinks[group.id]

  return createElement(
    'a',
    {
      className:
        'wf-research-gateway wf-research-gateway--ready',
      href: url,
      target: '_blank',
      rel: 'noreferrer',
    },

    createElement(
      'div',
      {
        className:
          'wf-research-gateway__content',
      },

      createElement(
        'div',
        {
          className:
            'wf-research-gateway__meta',
        },

        createElement(
          'span',
          {
            className:
              'wf-research-gateway__index',
          },
          group.index,
        ),

        createElement(
          'span',
          {
            className:
              'wf-research-gateway__label',
          },
          group.label,
        ),
      ),

      createElement(
        'h3',
        null,
        group.title,
      ),

      createElement(
        'p',
        {
          className:
            'wf-research-gateway__description',
        },
        group.description,
      ),
    ),

    createElement(
      'span',
      {
        className:
          'wf-research-gateway__action',
        'aria-hidden': 'true',
      },
      '카페에서 보기',
      createElement(
        'span',
        {
          className:
            'wf-research-gateway__arrow',
        },
        '↗',
      ),
    ),
  )
}

export default function ResearchPage() {
  return createElement(
    'main',
    {
      className: 'wf-research',
    },

    createElement(
      RouteResearchBookScroll,
      {
        rootSelector: '.wf-research',
        sections: [
          {
            selector:
              '.wf-research-hero',
            label: 'RESEARCH',
          },
          {
            selector:
              '.wf-research-archive',
            label: 'ARCHIVE',
          },
        ],
      },
    ),

    createElement(
      'section',
      {
        className: 'wf-research-hero',
        'aria-labelledby':
          'wf-research-title',
      },

      createElement(
        'div',
        {
          className:
            'wf-research-hero__inner',
        },

        createElement(
          'p',
          {
            className:
              'wf-research-hero__eyebrow',
          },
          'WINNINGFUND RESEARCH',
        ),

        createElement(
          RouteHeroTitle,
          {
            id: 'wf-research-title',
            className:
              'wf-research-hero__title',
            title: 'RESEARCH',
          },
        ),

        createElement(
          'div',
          {
            className:
              'wf-research-hero__taxonomy',
            'aria-label':
              'Research archive types',
          },

          createElement(
            'span',
            null,
            'INDIVIDUAL REPORT',
          ),

          createElement(
            'span',
            null,
            'TEAM REPORT',
          ),
        ),
      ),
    ),

    createElement(
      'section',
      {
        className:
          'wf-research-archive',
        'aria-labelledby':
          'wf-research-archive-title',
      },

      createElement(
        'div',
        {
          className:
            'wf-research-section__inner',
        },

        createElement(
          'header',
          {
            className:
              'wf-research-archive__header',
          },

          createElement(
            'p',
            {
              className:
                'wf-research-archive__eyebrow',
            },
            'SELECTED REPORTS',
          ),

          createElement(
            'h2',
            {
              id:
                'wf-research-archive-title',
            },
            '우수 리포트 아카이브',
          ),

          createElement(
            'p',
            {
              className:
                'wf-research-archive__copy',
            },
            '역대 위닝펀드 활동에서 선정된 우수 리포트를 개인 리포트와 팀 리포트로 나누어 소개합니다.',
          ),
        ),

        createElement(
          'div',
          {
            className:
              'wf-research-gateway-list',
            'aria-label':
              '우수 리포트 카페 아카이브',
          },

          ...archiveGroups.map(
            (group) =>
              createElement(
                ArchiveGateway,
                {
                  key: group.id,
                  group,
                },
              ),
          ),
        ),
      ),
    ),
  )
}
