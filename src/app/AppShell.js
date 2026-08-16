import { createElement } from 'react'
import { Outlet } from 'react-router'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import PageTransition from '../components/PageTransition.js'
import useRouteTransition from './useRouteTransition.js'
import logoUrl from '../assets/brand/winningfund-logo.png'
import {
  siteContentBundle,
  selectNavigation,
  selectSiteConfig,
} from '../content/index.js'

const siteConfig = selectSiteConfig(siteContentBundle)
/* WF PRIMARY NAV WITHOUT HOME + RESEARCH 2026-08 START */
const sourceNavigationItems =
  selectNavigation(siteContentBundle)

const researchNavigationItem =
  Object.freeze({
    id: 'research',
    label: 'RESEARCH',
    routeId: 'RESEARCH',
    order: 5,
    visibility: 'VISIBLE',
    path: '/research',
  })

const navigationItems =
  Object.freeze([
    ...sourceNavigationItems.filter(
      (item) =>
        item.routeId !== 'HOME' &&
        item.routeId !== 'RECRUITMENT',
    ),
    researchNavigationItem,
    ...sourceNavigationItems.filter(
      (item) =>
        item.routeId === 'RECRUITMENT',
    ),
  ])
/* WF PRIMARY NAV WITHOUT HOME + RESEARCH 2026-08 END */

const brand = Object.freeze({
  siteName: siteConfig.siteName,
  homePath: siteConfig.routeManifest.HOME,
  logoUrl,
  logoWidth: 189,
  logoHeight: 126,
})

export default function AppShell() {
  const transition = useRouteTransition()

  return createElement(
    PageTransition,
    {
      ...transition,
      brandLogoUrl: logoUrl,
    },
    createElement(
      'div',
      { className: 'wf-app-shell' },
      createElement(Header, {
        brand,
        navigationItems,
      }),
      createElement(
        'main',
        {
          id: 'main-content',
          className: 'wf-route-viewport',
        },
        createElement(Outlet),
      ),
      createElement(Footer, {
        siteName: siteConfig.siteName,
        secondaryText: '투자·경제 동아리',
      }),
    ),
  )
}
