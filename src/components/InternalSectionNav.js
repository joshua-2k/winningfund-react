import { createElement } from 'react'
import {
  Link,
  useLocation,
} from 'react-router'

export default function InternalSectionNav({
  items = [],
  activeSectionId,
  ariaLabel = 'Page sections',
  mode = 'links',
  onSelect,
}) {
  const location = useLocation()

  if (items.length === 0) return null

  const usesTabs =
    mode === 'tabs' &&
    typeof onSelect === 'function'

  return createElement(
    'nav',
    {
      className: 'wf-internal-section-nav',
      'aria-label': ariaLabel,
    },
    createElement(
      'ul',
      {
        className: 'wf-internal-section-nav__list',
        role: usesTabs ? 'tablist' : undefined,
      },
      ...items.map((item) => {
        const active =
          activeSectionId === item.id

        return createElement(
          'li',
          {
            key: item.id,
            className:
              'wf-internal-section-nav__item',
            role: usesTabs
              ? 'presentation'
              : undefined,
          },
          usesTabs
            ? createElement(
                'button',
                {
                  type: 'button',
                  className:
                    active
                      ? 'wf-internal-section-nav__link wf-internal-section-nav__link--active'
                      : 'wf-internal-section-nav__link',
                  role: 'tab',
                  'aria-selected': active,
                  'aria-controls':
                    `wf-activities-panel-${item.id}`,
                  tabIndex: active ? 0 : -1,
                  onClick: () =>
                    onSelect(item.id),
                },
                item.label,
              )
            : createElement(
                Link,
                {
                  className:
                    active
                      ? 'wf-internal-section-nav__link wf-internal-section-nav__link--active'
                      : 'wf-internal-section-nav__link',
                  to: {
                    pathname: location.pathname,
                    hash: `#${item.id}`,
                  },
                  'aria-current': active ? 'location' : undefined,
                },
                item.label,
              ),
        )
      }),
    ),
  )
}
