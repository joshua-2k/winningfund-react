import {
  createElement,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router'
import RouteResearchBookScroll from '../components/RouteResearchBookScroll.js'
import InternalSectionNav from '../components/InternalSectionNav.js'
import { RouteHeroTitle, RouteHeroWave } from '../components/RouteHeroEffects.js'
import ResponsiveMedia from '../components/ResponsiveMedia.js'
import {
  selectActivitiesPageData,
  selectAssetById,
  siteContentBundle,
} from '../content/index.js'

const activitiesData =
  selectActivitiesPageData(siteContentBundle)

function ActivityMedia({
  assetId,
  altText,
  caption,
  className = '',
  cropMode = 'cover',
}) {
  const assetRef = selectAssetById(
    siteContentBundle,
    assetId,
  )

  if (!assetRef) return null

  return createElement(
    'div',
    {
      className:
        `wf-activities-media ${className}`.trim(),
      'data-crop-mode': cropMode,
    },
    createElement(ResponsiveMedia, {
      assetRef,
      altText,
      caption,
      loadingPriority: 'LAZY',
      responsiveSizeIntent: '(min-width: 1024px) 42vw, 92vw',
      visualVariant: 'activities-source',
    }),
  )
}


function ProgramHeading({ activity }) {
  const isClasses =
    activity.activityId === 'classes'

  return createElement(
    'header',
    {
      className: 'wf-activities-program__heading',
    },

    createElement(
      'div',
      {
        className: 'wf-activities-program__number',
      },
      `PROGRAM ${activity.programNumber}`,
    ),

    createElement(
      'h2',
      isClasses
        ? {
            className:
              'wf-activities-program__title wf-activities-program__title--classes',
            'aria-label':
              '분반강의 (입문반 · 실전반)',
          }
        : {
            className:
              'wf-activities-program__title',
          },
      isClasses
        ? createElement(
            'span',
            {
              className:
                'wf-activities-program__title-line',
            },
            '분반강의',
          )
        : activity.pageTitle ?? activity.title,
      isClasses
        ? createElement(
            'span',
            {
              className:
                'wf-activities-program__title-line',
            },
            '(입문반 · 실전반)',
          )
        : null,
    ),

    createElement(
      'p',
      null,
      activity.pageSummary ?? activity.homeSummary,
    ),
  )
}
function SectorProgram({ activity }) {
  return createElement(
    'div',
    { className: 'wf-activities-sector' },
    createElement(ActivityMedia, {
      assetId: 'activity-sector-followup-photo',
      altText: '섹터별 팔로우업 활동 모습',
      caption: 'SECTOR FOLLOW-UP',
      className: 'wf-activities-sector__media',
    }),
    createElement(
      'ol',
      { className: 'wf-activities-detail-grid' },
      ...(activity.pageDetails ?? []).map((detail, index) =>
        createElement(
          'li',
          { key: detail.id },
          createElement('span', {
            className: 'wf-activities-detail-grid__index',
            'aria-hidden': 'true',
          }, String(index + 1).padStart(2, '0')),
          createElement('h3', null, detail.title),
          createElement('p', null, detail.description),
        ),
      ),
    ),
  )
}

function ClassesProgram({ activity }) {
  return createElement(
    'div',
    {
      className: 'wf-activities-class-grid',
    },
    ...(activity.tracks ?? []).map((track) =>
      createElement(
        'section',
        {
          key: track.id,
          className: 'wf-activities-class',
        },
        createElement(
          'span',
          {
            className:
              'wf-activities-class__english',
          },
          track.englishLabel,
        ),
        createElement(
          'h3',
          null,
          track.label,
        ),
        createElement(
          'ol',
          null,
          ...track.curriculum.map((item) =>
            createElement(
              'li',
              {
                key: item,
              },
              item,
            ),
          ),
        ),
      ),
    ),
  )
}

function MockProgram({ activity }) {
  const fm = activity.fmTeam
  const fmLabel = fm?.label ?? ''
  const fmParenIndex = fmLabel.indexOf('(')
  const fmMainLabel =
    fmParenIndex > 0
      ? fmLabel.slice(0, fmParenIndex).trim()
      : fmLabel
  const fmSubLabel =
    fmParenIndex > 0
      ? fmLabel.slice(fmParenIndex).trim()
      : null

  return createElement(
    'div',
    { className: 'wf-activities-investment' },
    createElement(
      'div',
      { className: 'wf-activities-investment__mock-grid' },
      ...(activity.mockGroups ?? []).map((group) =>
        createElement(
          'section',
          { key: group.id, className: 'wf-activities-investment__mock' },
          createElement('span', { className: 'wf-activities-investment__capital' }, group.capital),
          createElement('h3', null, group.label),
          createElement('ul', null, ...group.points.map((point) => createElement('li', { key: point }, point))),
        ),
      ),
    ),
    fm
      ? createElement(
          'section',
          { className: 'wf-activities-fm' },
          createElement(
            'div',
            { className: 'wf-activities-fm__lead' },
            createElement('span', null, 'FUND MANAGEMENT'),
            createElement(
              'h3',
              null,
              fmMainLabel,
              fmSubLabel
                ? createElement('br')
                : null,
              fmSubLabel
                ? createElement(
                    'span',
                    {
                      className:
                        'wf-activities-fm__sub-label',
                    },
                    fmSubLabel,
                  )
                : null,
            ),
            createElement('strong', null, fm.participation),
            createElement('p', null, fm.aum),
          ),
          createElement(ActivityMedia, {
            assetId: 'activity-fm-monthly-report-photo',
            altText: 'FM팀 월간 자산운용서 표지',
            caption: 'MONTHLY FUND REPORT',
            className: 'wf-activities-fm__media',
            cropMode: 'contain',
          }),
          createElement(
            'div',
            { className: 'wf-activities-fm__approaches' },
            ...fm.approaches.map((approach) =>
              createElement('div', { key: approach.label },
                createElement('strong', null, approach.label),
                createElement('p', null, approach.description),
              ),
            ),
          ),
          createElement(
            'div',
            { className: 'wf-activities-fm__operations' },
            ...fm.operations.map((operation) =>
              createElement('div', { key: operation.title },
                createElement('strong', null, operation.title),
                createElement('p', null, operation.description),
              ),
            ),
          ),
        )
      : null,
  )
}

function ReportsProgram({ activity }) {
  const teamReportBoardUrl =
    'https://cafe.naver.com/f-e/cafes/26340278/menus/499?viewType=L'
  const personalMedia = {
    'individual-strategy': ['activity-individual-strategy-report-photo', '투자전략 리포트 예시'],
    'individual-company': ['activity-individual-company-report-photo', '기업분석 리포트 예시'],
  }

  return createElement(
    'div',
    { className: 'wf-activities-reports' },
    createElement(
      'section',
      { className: 'wf-activities-reports__team' },
      createElement('span', null, 'TEAM REPORT'),
      createElement('h3', null, activity.teamReport?.label),
      createElement(ActivityMedia, {
        assetId: 'activity-team-report-presentation-photo',
        altText: '팀리포트 발표 모습',
        caption: 'TEAM REPORT',
        className: 'wf-activities-reports__team-media',
      }),
      createElement(
        'a',
        {
          className:
            'wf-activities-reports__board-link',
          href: teamReportBoardUrl,
          target: '_blank',
          rel: 'noreferrer',
        },
        createElement(
          'span',
          null,
          '팀리포트 게시판 보기',
        ),
        createElement(
          'span',
          {
            'aria-hidden': 'true',
          },
          '↗',
        ),
      ),
      createElement('ul', null,
        ...(activity.teamReport?.points ?? []).map((point) => createElement('li', { key: point }, point)),
      ),
    ),
    createElement(
      'div',
      { className: 'wf-activities-reports__personal' },
      createElement(
        'div',
        { className: 'wf-activities-reports__personal-head' },
        createElement('span', null, 'PERSONAL REPORT'),
        createElement('strong', null, '개인리포트'),
      ),
      ...(activity.personalReports ?? []).map((report, index) => {
        const media = personalMedia[report.id]
        return createElement(
          'section',
          { key: report.id, className: 'wf-activities-reports__personal-item' },
          createElement('span', { 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
          createElement(
            'div',
            { className: 'wf-activities-reports__personal-copy' },
            createElement('h3', null, report.label),
            createElement('p', null, report.description),
          ),
          media
            ? createElement(ActivityMedia, {
                assetId: media[0],
                altText: media[1],
                caption: report.label,
                className: 'wf-activities-reports__personal-media',
              })
            : null,
        )
      }),
    ),
  )
}

function ProgramBody({ activity }) {
  switch (activity.activityId) {
    case 'sector-followup':
      return createElement(SectorProgram, {
        activity,
      })

    case 'classes':
      return createElement(ClassesProgram, {
        activity,
      })

    case 'mock-investment-fm':
      return createElement(MockProgram, {
        activity,
      })

    case 'reports':
      return createElement(ReportsProgram, {
        activity,
      })

    default:
      return null
  }
}

function ProgramSection({ activity }) {
  return createElement(
    'section',
    {
      id: activity.activityId,
      className:
        `wf-activities-program wf-activities-program--${activity.programNumber}`,
      'data-activities-section': activity.activityId,
      'aria-labelledby':
        `wf-activities-${activity.activityId}-title`,
    },

    createElement(
      'div',
      {
        className: 'wf-activities-section__inner',
      },

      createElement(
        'div',
        {
          id: `wf-activities-${activity.activityId}-title`,
        },
        createElement(ProgramHeading, {
          activity,
        }),
      ),

      createElement(ProgramBody, {
        activity,
      }),
    ),
  )
}

function OtherAcademic({ items }) {
  const academicMedia = {
    'stock-game': ['activity-stock-game-photo', '주식 게임 활동 모습'],
    'stock-mentoring': ['activity-stock-mentoring-photo', '주식 멘토링 활동 모습'],
  }

  return createElement(
    'section',
    {
      id: 'other-academic',
      className: 'wf-activities-chapter wf-activities-chapter--academic',
      'data-activities-section': 'other-academic',
      'aria-labelledby': 'wf-activities-other-academic-title',
    },
    createElement(
      'div',
      { className: 'wf-activities-section__inner' },
      createElement(
        'header',
        { className: 'wf-activities-chapter__heading' },
        createElement('span', null, '05 / MORE ACADEMIC'),
        createElement('h2', { id: 'wf-activities-other-academic-title' }, '그 외 학술활동'),
      ),
      createElement(
        'div',
        { className: 'wf-activities-academic-list' },
        ...items.map((item, index) => {
          const media = academicMedia[item.id]
          return createElement(
            'article',
            { key: item.id },
            createElement('span', { 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
            createElement(
              'div',
              { className: 'wf-activities-academic-list__copy' },
              createElement('h3', null, item.title),
              createElement('p', null, item.description),
            ),
            media
              ? createElement(ActivityMedia, {
                  assetId: media[0],
                  altText: media[1],
                  caption: item.title,
                  className: 'wf-activities-academic-list__media',
                })
              : null,
          )
        }),
      ),
    ),
  )
}

function SmallGroups({
  clubs,
  title,
  introduction,
}) {
  return createElement(
    'section',
    {
      id: 'small-groups',
      className:
        'wf-activities-chapter wf-activities-chapter--clubs',
      'data-activities-section':
        'small-groups',
      'aria-labelledby':
        'wf-activities-clubs-title',
    },

    createElement(
      'div',
      {
        className: 'wf-activities-section__inner',
      },

      createElement(
        'header',
        {
          className:
            'wf-activities-clubs__heading',
        },
        createElement(
          'div',
          null,
          createElement(
            'span',
            null,
            '06 / SMALL GROUPS',
          ),
          createElement(
            'h2',
            {
              id: 'wf-activities-clubs-title',
            },
            title,
          ),
        ),
        createElement(
          'p',
          null,
          introduction,
        ),
      ),

      createElement(
        'div',
        {
          className: 'wf-activities-clubs__grid',
        },
        ...clubs.map((club, index) =>
          createElement(
            'article',
            {
              key: club.clubId,
              className: 'wf-activities-club',
            },
            createElement(
              'span',
              {
                className:
                  'wf-activities-club__number',
                'aria-hidden': 'true',
              },
              String(index + 1).padStart(2, '0'),
            ),
            createElement(
              'span',
              {
                className:
                  'wf-activities-club__category',
              },
              club.categoryLabel,
            ),
            createElement(
              'h3',
              null,
              club.officialName,
            ),
            createElement(
              'p',
              null,
              club.description,
            ),
          ),
        ),
      ),
    ),
  )
}

function ActivitiesIntroHeadline({ headline = '' }) {
  const accentText = '스스로 판단하는'
  const accentIndex = headline.indexOf(accentText)

  if (accentIndex < 0) {
    return createElement(
      'h2',
      {
        className:
          'wf-activities-intro__headline',
      },
      headline,
    )
  }

  const beforeAccent =
    headline.slice(0, accentIndex).trim()

  const afterAccent =
    headline
      .slice(accentIndex + accentText.length)
      .trim()

  return createElement(
    'h2',
    {
      className:
        'wf-activities-intro__headline',
      'aria-label': headline,
    },

    beforeAccent
      ? createElement(
          'span',
          {
            className:
              'wf-activities-intro__headline-line',
          },
          beforeAccent,
        )
      : null,

    createElement(
      'span',
      {
        className:
          'wf-activities-intro__headline-line wf-activities-intro__headline-line--accent',
      },
      accentText,
    ),

    afterAccent
      ? createElement(
          'span',
          {
            className:
              'wf-activities-intro__headline-line',
          },
          afterAccent,
        )
      : null,
  )
}

export default function ActivitiesPage() {
  const location = useLocation()

  const {
    activitiesPage,
    activitySections,
    otherAcademicActivities,
    clubs,
  } = activitiesData

  const programs = [...activitySections].sort(
    (a, b) => a.order - b.order,
  )

  const navItems = [
    ...programs.map((activity) => ({
      id: activity.activityId,
      label: activity.programNumber,
    })),
    {
      id: 'other-academic',
      label: '학술활동',
    },
    {
      id: 'small-groups',
      label: '소모임',
    },
  ]

  const requestedSectionId =
    decodeURIComponent(
      location.hash.replace(/^#/, ''),
    )

  const initialSectionId =
    navItems.some(
      (item) =>
        item.id === requestedSectionId,
    )
      ? requestedSectionId
      : programs[0]?.activityId

  const [activeSectionId, setActiveSectionId] =
    useState(initialSectionId)

  useEffect(() => {
    const hashSectionId =
      decodeURIComponent(
        location.hash.replace(/^#/, ''),
      )

    if (
      navItems.some(
        (item) =>
          item.id === hashSectionId,
      )
    ) {
      setActiveSectionId(hashSectionId)
    }
  }, [location.hash])

  const activeProgram = programs.find(
    (activity) =>
      activity.activityId ===
      activeSectionId,
  )

  let activeContent = null

  if (activeProgram) {
    activeContent = createElement(
      ProgramSection,
      {
        key: activeProgram.activityId,
        activity: activeProgram,
      },
    )
  } else if (
    activeSectionId === 'other-academic'
  ) {
    activeContent = createElement(
      OtherAcademic,
      {
        items: otherAcademicActivities,
      },
    )
  } else if (
    activeSectionId === 'small-groups'
  ) {
    activeContent = createElement(
      SmallGroups,
      {
        clubs,
        title:
          activitiesPage?.clubsTitle ??
          '소모임',
        introduction:
          activitiesPage?.clubsIntroduction,
      },
    )
  }


  /* WF HOME-TO-ACTIVITIES DEEP SCROLL 2026-08 */
  useEffect(() => {
    const hashSectionId =
      decodeURIComponent(
        location.hash.replace(/^#/, ''),
      )

    if (
      !hashSectionId ||
      hashSectionId !== activeSectionId ||
      !navItems.some(
        (item) =>
          item.id === hashSectionId,
      )
    ) {
      return undefined
    }

    const frameId =
      requestAnimationFrame(() => {
        const target =
          document.getElementById(
            hashSectionId,
          )

        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [activeSectionId, location.hash])

  return createElement(
    'main',
    {
      className: 'wf-activities',
    },
    createElement(RouteResearchBookScroll, {
      rootSelector: '.wf-activities',
      sections: [
      {
        selector: '.wf-activities-hero',
        label: 'ACTIVITIES',
      },
      {
        selector: '.wf-activities-intro',
        label: 'SYSTEM',
      },
      {
        selector: '.wf-activities-internal-nav',
        label: 'PROGRAMS',
      },
      ],
    }),
createElement(
      'section',
      {
        className:
          'wf-activities-hero',
        'aria-labelledby':
          'wf-activities-title',
      },
      createElement(
        'div',
        {
          className:
            'wf-activities-hero__inner',
        },
        createElement(
          'p',
          {
            className:
              'wf-activities-hero__eyebrow',
          },
          'WINNINGFUND',
        ),
        createElement(RouteHeroTitle, {
          id: 'wf-activities-title',
          className:
            'wf-activities-hero__title',
          title: 'ACTIVITIES',
        }),
      ),
      createElement(RouteHeroWave, {
        waveId:
          'wf-activities-route-wave',
        surface: 'white',
      }),
    ),

    createElement(
      'section',
      {
        className:
          'wf-activities-intro',
      },
      createElement(
        'div',
        {
          className:
            'wf-activities-section__inner',
        },
        createElement(
          'div',
          {
            className:
              'wf-activities-intro__index',
          },
          'ACTIVITY SYSTEM',
        ),
        createElement(ActivitiesIntroHeadline, {
          headline:
            activitiesPage?.introHeadline,
        }),
        createElement(
          'div',
          {
            className:
              'wf-activities-intro__copy',
          },
          ...(activitiesPage
            ?.introParagraphs ?? []
          ).map((paragraph) =>
            createElement(
              'p',
              {
                key: paragraph,
              },
              paragraph,
            ),
          ),
        ),
      ),
    ),

    createElement(
      'div',
      {
        className:
          'wf-activities-internal-nav wf-activities-tabs',
      },
      createElement(InternalSectionNav, {
        items: navItems,
        activeSectionId,
        ariaLabel: '활동 페이지 목차',
        mode: 'tabs',
        onSelect: setActiveSectionId,
      }),
    ),

    createElement(
      'div',
      {
        id:
          `wf-activities-panel-${activeSectionId}`,
        className:
          'wf-activities-tab-stage',
        role: 'tabpanel',
        'aria-labelledby':
          `wf-activities-tab-${activeSectionId}`,
      },
      activeContent,
    ),
  )
}
