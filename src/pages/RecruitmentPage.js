import { createElement } from 'react'
import RouteResearchBookScroll from '../components/RouteResearchBookScroll.js'
import CTAButton from '../components/CTAButton.js'
import { RouteHeroTitle, RouteHeroWave } from '../components/RouteHeroEffects.js'
import {
  selectRecruitmentPageData,
  selectSiteConfig,
  siteContentBundle,
} from '../content/index.js'

const recruitmentData =
  selectRecruitmentPageData(siteContentBundle)

const siteConfig =
  selectSiteConfig(siteContentBundle)

const NEW_MEMBER_APPLICATION_URL =
  'https://cafe.naver.com/f-e/cafes/26340278/articles/40062?menuid=453&referrerAllArticles=false'

const EXISTING_MEMBER_APPLICATION_URL =
  'https://cafe.naver.com/f-e/cafes/26340278/articles/40063?menuid=453&referrerAllArticles=false'

function parseLocalDate(value, endOfDay = false) {
  if (!value) return null

  const [year, month, day] = value
    .split('-')
    .map(Number)

  if (![year, month, day].every(Number.isFinite)) {
    return null
  }

  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  )
}

function resolvePeriodState(period) {
  const start = parseLocalDate(period?.startAt)
  const end = parseLocalDate(period?.endAt, true)

  if (!start || !end) {
    return {
      state: 'UNKNOWN',
      label: 'SCHEDULE TBD',
      detail: '모집 일정 확인 중',
    }
  }

  const now = new Date()

  if (now < start) {
    return {
      state: 'COMING_SOON',
      label: 'COMING SOON',
      detail: `${start.getMonth() + 1}월 ${start.getDate()}일부터`,
    }
  }

  if (now > end) {
    return {
      state: 'CLOSED',
      label: 'CLOSED',
      detail: '모집 기간 종료',
    }
  }

  return {
    state: 'OPEN',
    label: 'OPEN NOW',
    detail: `${end.getMonth() + 1}월 ${end.getDate()}일까지`,
  }
}

function formatDateToken(value) {
  if (!value) return '--.--'

  const [, month, day] = value.split('-')
  return `${month}.${day}`
}

function RecruitmentTermLabel({
  term,
  suffix = null,
}) {
  const parts =
    String(term ?? '')
      .split('-')

  if (parts.length !== 2) {
    return createElement(
      'span',
      {
        className:
          'wf-recruitment-term-label',
      },
      term,
      suffix
        ? ` ${suffix}`
        : null,
    )
  }

  const [
    first,
    second,
  ] = parts

  return createElement(
    'span',
    {
      className:
        'wf-recruitment-term-label',
      'aria-label':
        `${first}-${second}${suffix ? ` ${suffix}` : ''}`,
    },

    createElement(
      'span',
      {
        className:
          'wf-recruitment-term-label__part',
        'aria-hidden': 'true',
      },
      first,
    ),

    createElement(
      'span',
      {
        className:
          'wf-recruitment-term-label__hyphen',
        'aria-hidden': 'true',
      },
      '-',
    ),

    createElement(
      'span',
      {
        className:
          'wf-recruitment-term-label__part',
        'aria-hidden': 'true',
      },
      second,
    ),

    suffix
      ? createElement(
          'span',
          {
            className:
              'wf-recruitment-term-label__suffix',
            'aria-hidden': 'true',
          },
          suffix,
        )
      : null,
  )
}

export default function RecruitmentPage() {
  const { record } = recruitmentData
  const period = record?.period
  const periodState = resolvePeriodState(period)
  const term = siteConfig.currentTermId ?? '18-2'
const startToken = formatDateToken(period?.startAt)
  const endToken = formatDateToken(period?.endAt)

  return createElement(
    'main',
    {
      className: 'wf-recruitment',
    },
    createElement(RouteResearchBookScroll, {
      rootSelector: '.wf-recruitment',
      sections: [
      {
        selector: '.wf-recruitment-hero',
        label: 'RECRUIT',
      },
      {
        selector: '.wf-recruitment-info',
        label: 'INFO',
      },
      {
        selector: '.wf-recruitment-action',
        label: 'APPLY',
      },
      ],
    }),
createElement(
      'section',
      {
        className: 'wf-recruitment-hero',
        'aria-labelledby': 'wf-recruitment-title',
      },

      createElement(
        'div',
        {
          className: 'wf-recruitment-hero__inner',
        },

        createElement(
          'div',
          {
            className: 'wf-recruitment-hero__topline',
          },
          createElement('span', null, 'WINNINGFUND'),
          createElement(
            'span',
            {
              className: 'wf-recruitment-hero__term',
            },
            createElement(
              RecruitmentTermLabel,
              {
                term,
                suffix: 'RECRUITMENT',
              },
            ),
          ),
        ),

        createElement(RouteHeroTitle, {
          id: 'wf-recruitment-title',
          className: 'wf-recruitment-hero__title',
          title: 'RECRUITMENT',
          alignment: 'left',
        }),

        createElement(
          'div',
          {
            className: 'wf-recruitment-hero__bottom',
          },

          createElement(
            'div',
            {
              className: 'wf-recruitment-hero__period',
            },
            createElement('span', null, startToken),
            createElement(
              'span',
              {
                className: 'wf-recruitment-hero__period-rule',
                'aria-hidden': 'true',
              },
            ),
            createElement('span', null, endToken),
          ),

          createElement(
            'div',
            {
              className: 'wf-recruitment-status',
              'data-state': periodState.state,
            },
            createElement(
              'span',
              {
                className: 'wf-recruitment-status__dot',
                'aria-hidden': 'true',
              },
            ),
            createElement(
              'div',
              null,
              createElement('strong', null, periodState.label),
              createElement('span', null, periodState.detail),
            ),
          ),
        ),
      ),

      createElement(RouteHeroWave, { waveId: 'wf-recruitment-route-wave', surface: 'white' }),
    ),

    createElement(
      'section',
      {
        className: 'wf-recruitment-info',
        'aria-labelledby': 'wf-recruitment-info-title',
      },

      createElement(
        'div',
        {
          className: 'wf-recruitment-section__inner',
        },

        createElement(
          'header',
          {
            className: 'wf-recruitment-info__heading',
          },
          createElement(
            'span',
            null,
            'APPLICATION INFO',
          ),
          createElement(
            'h2',
            {
              id: 'wf-recruitment-info-title',
            },
            '다음 위닝펀드에 함께하세요.',
          ),
        ),

        createElement(
          'dl',
          {
            className: 'wf-recruitment-facts',
          },

          createElement(
            'div',
            null,
            createElement('span', { 'aria-hidden': 'true' }, '01'),
            createElement('dt', null, 'TERM'),
            createElement(
              'dd',
              null,
              createElement(
                RecruitmentTermLabel,
                {
                  term,
                },
              ),
            ),
          ),

          createElement(
            'div',
            null,
            createElement('span', { 'aria-hidden': 'true' }, '02'),
            createElement('dt', null, 'PERIOD'),
            createElement(
              'dd',
              null,
              period?.displayText ?? `${startToken} — ${endToken}`,
            ),
          ),

          createElement(
            'div',
            null,
            createElement('span', { 'aria-hidden': 'true' }, '03'),
            createElement('dt', null, 'APPLICATION'),
            createElement(
              'dd',
              {
                className:
                  'wf-recruitment-facts__application',
              },
              createElement(
                'strong',
                null,
                '신입 · 기존회원 지원 링크 공개',
              ),
              createElement(
                'small',
                null,
                '지원은 페이지 하단의 신입회원·기존회원 지원 링크를 참고해 주세요.',
              ),
            ),
          ),
        ),
      ),
    ),

    createElement(
      'section',
      {
        className: 'wf-recruitment-action',
        'aria-labelledby': 'wf-recruitment-action-title',
      },

      createElement(
        'div',
        {
          className: 'wf-recruitment-section__inner',
        },

        createElement(
          'div',
          {
            className: 'wf-recruitment-action__copy',
          },
          createElement('span', null, 'JOIN WINNINGFUND'),
          createElement(
            'h2',
            {
              id: 'wf-recruitment-action-title',
            },
            createElement(
              RecruitmentTermLabel,
              {
                term,
              },
            ),
          ),
          createElement(
            'p',
            null,
            '지원 유형에 맞는 링크를 선택해 주세요.',
          ),
        ),

        createElement(
          'div',
          {
            className:
              'wf-recruitment-action__buttons',
          },
          createElement(CTAButton, {
            label: '신입회원 지원 ↗',
            intentType: 'EXTERNAL',
            target:
              NEW_MEMBER_APPLICATION_URL,
            availability: 'AVAILABLE',
            emphasisVariant: 'primary',
          }),
          createElement(CTAButton, {
            label: '기존회원 지원 ↗',
            intentType: 'EXTERNAL',
            target:
              EXISTING_MEMBER_APPLICATION_URL,
            availability: 'AVAILABLE',
            emphasisVariant: 'primary',
          }),
        ),
      ),
    ),
  )
}
