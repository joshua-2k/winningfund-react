export const SITE_URL = 'https://winningfund.kr'

export const SITE_IDENTITY = Object.freeze({
  name: '위닝펀드',
  alternateName: [
    'WinningFund',
    '위닝',
  ],
  siteName: '위닝펀드 | WinningFund',
  description:
    '위닝펀드는 대학생이 함께 시장과 기업을 분석하고 투자 아이디어를 검증하는 대학연합투자동아리입니다.',
  foundingDate: '2009',
  sameAs: [
    'https://www.instagram.com/winning_fund/',
    'https://cafe.naver.com/winningfund',
  ],
})

export const SEO_ROUTES = Object.freeze([
  Object.freeze({
    path: '/',
    canonicalPath: '/',
    title:
      '위닝펀드 | 대학연합투자동아리 WinningFund',
    description:
      '위닝펀드(WinningFund)는 대학생이 함께 시장과 기업을 분석하고 투자 아이디어를 검증하는 대학연합투자동아리입니다. 기업분석, 투자 리포트, 주식·투자 스터디와 다양한 활동을 운영합니다.',
  }),

  Object.freeze({
    path: '/about',
    canonicalPath: '/about/',
    title:
      '위닝펀드 소개 | 대학연합투자동아리 WinningFund',
    description:
      '위닝펀드(WinningFund)는 2009년 출범한 대학생 연합투자동아리입니다. 연합동아리 위닝펀드의 소개, 활동 방향, 조직과 네트워크를 확인하세요.',
  }),

  Object.freeze({
    path: '/members',
    canonicalPath: '/members/',
    title:
      '위닝펀드 임원진 | 연합투자동아리 WinningFund',
    description:
      '대학연합투자동아리 위닝펀드(WinningFund)의 현재 임원진과 역대 운영진을 소개합니다. 위닝을 함께 만들어온 구성원과 기수별 기록을 확인하세요.',
  }),

  Object.freeze({
    path: '/activities',
    canonicalPath: '/activities/',
    title:
      '위닝펀드 활동 | 기업분석·투자스터디·주식동아리',
    description:
      '위닝펀드의 기업분석, 투자 리포트, 주식·투자 스터디, 모의투자, 분반강의와 소모임 활동을 소개합니다. 대학생 투자동아리의 학술·친목 프로그램을 확인하세요.',
  }),

  Object.freeze({
    path: '/research',
    canonicalPath: '/research/',
    title:
      '위닝펀드 리포트 | 기업분석·투자리포트 WinningFund',
    description:
      '위닝펀드(WinningFund)의 기업분석 및 투자 리포트 아카이브입니다. 주식과 산업을 분석한 개인 리포트와 팀 리포트를 확인하세요.',
  }),

  Object.freeze({
    path: '/recruitment',
    canonicalPath: '/recruitment/',
    title:
      '위닝펀드 모집 | 대학연합투자동아리·연합동아리 모집',
    description:
      '대학연합투자동아리 위닝펀드(WinningFund) 모집 안내입니다. 투자·주식·기업분석에 관심 있는 대학생을 위한 연합동아리 지원 일정과 지원 링크를 확인하세요.',
  }),
])

function normalizePath(pathname) {
  if (!pathname) return '/'

  const withoutHash =
    String(pathname)
      .split('#')[0]
      .split('?')[0]

  const normalized =
    withoutHash
      .replace(/\/+/g, '/')
      .replace(/\/+$/, '')

  return normalized || '/'
}

export function resolveSeo(pathname) {
  const normalized =
    normalizePath(pathname)

  return (
    SEO_ROUTES.find(
      (entry) =>
        normalizePath(entry.path) === normalized,
    )
    ?? SEO_ROUTES[0]
  )
}

export function absoluteUrl(canonicalPath) {
  return new URL(
    canonicalPath,
    SITE_URL,
  ).href
}

export function buildStructuredData(entry) {
  const pageUrl =
    absoluteUrl(entry.canonicalPath)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_IDENTITY.name,
        alternateName:
          SITE_IDENTITY.alternateName,
        url: `${SITE_URL}/`,
        foundingDate:
          SITE_IDENTITY.foundingDate,
        description:
          SITE_IDENTITY.description,
        sameAs:
          SITE_IDENTITY.sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_IDENTITY.siteName,
        alternateName:
          SITE_IDENTITY.alternateName,
        inLanguage: 'ko-KR',
        publisher: {
          '@id':
            `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: entry.title,
        description:
          entry.description,
        inLanguage: 'ko-KR',
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id':
            `${SITE_URL}/#organization`,
        },
      },
    ],
  }
}
