import { createElement } from 'react'
import RouteHeroMagneticScroll from '../components/RouteHeroMagneticScroll.js'
import { RouteHeroTitle, RouteHeroWave } from '../components/RouteHeroEffects.js'
import Accordion from '../components/Accordion.js'
import MemberGrid from '../components/MemberGrid.js'
import {
  selectAssetById,
  selectMembersPageData,
  siteContentBundle,
} from '../content/index.js'

const membersData =
  selectMembersPageData(siteContentBundle)

function HistoricalMembers({ term }) {
  if (term.dataStatus !== 'AVAILABLE') {
    return null
  }

  return createElement(
    'ul',
    {
      className: 'wf-members-history__names',
    },
    ...term.members.map((member) =>
      createElement(
        'li',
        {
          key: member.memberId,
        },
        member.name,
      ),
    ),
  )
}

function TermLabel({ label }) {
  const rawLabel = String(label ?? '')
  const separatorIndex = rawLabel.indexOf('-')

  if (separatorIndex < 0) {
    return createElement(
      'span',
      {
        className: 'wf-members-term-label',
      },
      `${rawLabel}기`,
    )
  }

  const left =
    rawLabel.slice(0, separatorIndex)

  const right =
    rawLabel.slice(separatorIndex + 1)

  return createElement(
    'span',
    {
      className: 'wf-members-term-label',
      'aria-label': `${rawLabel}기`,
    },
    createElement(
      'span',
      {
        className:
          'wf-members-term-label__number',
        'aria-hidden': 'true',
      },
      left,
    ),
    createElement(
      'span',
      {
        className:
          'wf-members-term-label__hyphen',
        'aria-hidden': 'true',
      },
      '-',
    ),
    createElement(
      'span',
      {
        className:
          'wf-members-term-label__number',
        'aria-hidden': 'true',
      },
      `${right}기`,
    ),
  )
}

export default function MembersPage() {
  const terms = [...membersData.terms].sort(
    (a, b) => a.order - b.order,
  )

  const current =
    terms.find(
      (term) =>
        term.termId === membersData.currentTermId,
    ) ?? terms[0]

  const historical = terms.filter(
    (term) =>
      term.termId !== current?.termId &&
      term.dataStatus === 'AVAILABLE',
  )

  return createElement(
    'main',
    {
      className: 'wf-members',
    },

    createElement(RouteHeroMagneticScroll, {
      heroSelector: '.wf-members-hero',
      nextSelector: '.wf-members-section--current',
    }),

    createElement(
      'section',
      {
        className: 'wf-members-hero',
        'aria-labelledby': 'wf-members-title',
      },

      createElement(
        'div',
        {
          className: 'wf-members-hero__inner',
        },

        createElement(
          'p',
          {
            className: 'wf-members-hero__eyebrow',
          },
          'WINNINGFUND',
        ),

        createElement(RouteHeroTitle, {
          id: 'wf-members-title',
          className: 'wf-members-hero__title',
          title: 'MEMBERS',
        }),

        createElement(
          'p',
          {
            className: 'wf-members-hero__copy',
          },
          '위닝펀드를 거쳐간 1-1기부터 현재까지, 모든 기수의 발자취를 소개합니다.',
        ),
      ),

      createElement(RouteHeroWave, { waveId: 'wf-members-route-wave', surface: 'soft' }),
    ),

    current
      ? createElement(
          'section',
          {
            className:
              'wf-members-section wf-members-section--current',
            'aria-label': `${current.label}기 current team`,
          },

          createElement(
            'div',
            {
              className: 'wf-members-section__inner',
            },

            createElement(
              'div',
              {
                className:
                  'wf-members-current__heading',
              },
              createElement(
                'div',
                {
                  className:
                    'wf-members-current__meta',
                },
                createElement(
                  'strong',
                  null,
                  createElement(TermLabel, {
                    label: current.label,
                  }),
                ),
                createElement(
                  'span',
                  {
                    className:
                      'wf-members-current__badge',
                  },
                  'CURRENT TEAM',
                ),
              ),
            ),
            createElement(MemberGrid, {
              members: current.members,
              generationContext: current.termId,
              assetResolver: (assetId) =>
                selectAssetById(
                  siteContentBundle,
                  assetId,
                ),
              layoutVariant: 'members-current',
            }),
          ),
        )
      : null,

    createElement(
      'section',
      {
        className:
          'wf-members-section wf-members-section--history',
        'aria-labelledby':
          'wf-members-history-title',
      },

      createElement(
        'div',
        {
          className: 'wf-members-section__inner',
        },

        createElement(
          'div',
          {
            className: 'wf-members-history__heading',
          },
          createElement(
            'h2',
            {
              id: 'wf-members-history-title',
            },
            '역대 임원진',
          ),
        ),
        createElement(Accordion, {
          items: historical,
          itemIdResolver: (term) => term.termId,
          defaultOpenIds: [],
          multipleOpen: true,
          ariaLabel: '위닝펀드 역대 기수',
          headerContentResolver: (term) =>
            createElement(
              'span',
              {
                className:
                  'wf-members-history__trigger-content',
              },
              createElement(
                'strong',
                null,
                createElement(TermLabel, {
                  label: term.label,
                }),
              ),
              createElement(
                'span',
                null,
                `${term.members.length}명`,
              ),
            ),
          panelContentResolver: (term) =>
            createElement(HistoricalMembers, {
              term,
            }),
        }),
      ),
    ),
  )
}
