import {
  createElement,
  useEffect,
  useState,
} from 'react'

const HOME_SECTIONS = Object.freeze([
  {
    id: 'home-hero',
    label: 'HOME',
  },
  {
    id: 'short-introduction',
    label: 'INTRO',
  },
  {
    id: 'program-overview',
    label: 'ACTIVITY',
  },
  {
    id: 'mission',
    label: 'MISSION',
  },
  {
    id: 'contents-18-2',
    label: 'SCHEDULE',
  },
])

const FINE_POINTER_QUERY =
  '(hover: hover) and (pointer: fine)'

const REDUCED_MOTION_QUERY =
  '(prefers-reduced-motion: reduce)'

const WHEEL_THRESHOLD = 26
const WHEEL_RESET_MS = 135
const POST_SNAP_LOCK_MS = 95

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function easeOutQuart(progress) {
  return 1 - Math.pow(1 - progress, 4)
}

function isEditableTarget(target) {
  if (!(target instanceof Element)) return false

  return Boolean(
    target.closest(
      'input, textarea, select, [contenteditable="true"]',
    ),
  )
}

function getHeaderHeight() {
  const header =
    document.querySelector('.wf-header')

  return header
    ? Math.round(
        header.getBoundingClientRect().height,
      )
    : 72
}

function getSectionTop(
  section,
  headerHeight,
) {
  return Math.max(
    0,
    section.getBoundingClientRect().top
      + window.scrollY
      - headerHeight,
  )
}

function getClosestSectionIndex(
  sections,
  headerHeight,
) {
  const viewportAnchor =
    window.scrollY
    + headerHeight
    + Math.max(
      1,
      (
        window.innerHeight
        - headerHeight
      ) * 0.34,
    )

  let bestIndex = 0
  let bestDistance = Number.POSITIVE_INFINITY

  sections.forEach(
    (section, index) => {
      const sectionTop =
        section.getBoundingClientRect().top
        + window.scrollY

      const sectionBottom =
        sectionTop + section.offsetHeight

      let distance = 0

      if (viewportAnchor < sectionTop) {
        distance =
          sectionTop - viewportAnchor
      } else if (
        viewportAnchor > sectionBottom
      ) {
        distance =
          viewportAnchor - sectionBottom
      }

      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    },
  )

  return bestIndex
}

export default function HomeMagneticScroll() {
  const [activeIndex, setActiveIndex] =
    useState(0)

  useEffect(() => {
    const pointerMedia =
      window.matchMedia(
        FINE_POINTER_QUERY,
      )

    const reducedMotionMedia =
      window.matchMedia(
        REDUCED_MOTION_QUERY,
      )

    const homeRoot =
      document.querySelector('.wf-home')

    const sections =
      HOME_SECTIONS
        .map(
          ({ id }) =>
            document.getElementById(id),
        )
        .filter(Boolean)

    if (
      !homeRoot ||
      sections.length
        !== HOME_SECTIONS.length
    ) {
      return undefined
    }

    homeRoot.classList.add(
      'wf-home--research-book',
    )

    sections.forEach((section) => {
      section.classList.add(
        'wf-home-book-section',
      )
    })

    let wheelAccumulator = 0
    let wheelResetTimer = 0
    let animationFrame = 0
    let scrollFrame = 0
    let locked = false

    function markAllRevealed() {
      sections.forEach((section) => {
        section.classList.add(
          'wf-home-book-section--seen',
        )
      })
    }

    let revealObserver = null

    if (
      reducedMotionMedia.matches ||
      !('IntersectionObserver' in window)
    ) {
      markAllRevealed()
    } else {
      revealObserver =
        new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return
              }

              entry.target.classList.add(
                'wf-home-book-section--seen',
              )
            })
          },
          {
            threshold: 0.16,
            rootMargin:
              '-4% 0px -12% 0px',
          },
        )

      sections.forEach((section) => {
        revealObserver.observe(section)
      })

      sections[0].classList.add(
        'wf-home-book-section--seen',
      )
    }

    function resetWheelAccumulator() {
      wheelAccumulator = 0

      if (wheelResetTimer) {
        window.clearTimeout(
          wheelResetTimer,
        )

        wheelResetTimer = 0
      }
    }

    function stopAnimation() {
      if (animationFrame) {
        window.cancelAnimationFrame(
          animationFrame,
        )

        animationFrame = 0
      }

      locked = false
    }

    function syncActiveIndex() {
      scrollFrame = 0

      const nextIndex =
        getClosestSectionIndex(
          sections,
          getHeaderHeight(),
        )

      setActiveIndex(
        (current) =>
          current === nextIndex
            ? current
            : nextIndex,
      )
    }

    function scheduleActiveSync() {
      if (scrollFrame) return

      scrollFrame =
        window.requestAnimationFrame(
          syncActiveIndex,
        )
    }

    function findCurrentIndex(
      headerHeight,
    ) {
      const viewportTop =
        window.scrollY
        + headerHeight
        + 3

      let index = 0

      for (
        let candidate = 0;
        candidate < sections.length;
        candidate += 1
      ) {
        const sectionTop =
          sections[candidate]
            .getBoundingClientRect()
            .top
          + window.scrollY

        if (
          sectionTop <= viewportTop
        ) {
          index = candidate
        }
      }

      return index
    }

    function animateTo(targetTop) {
      stopAnimation()

      const startTop =
        window.scrollY

      const distance =
        targetTop - startTop

      if (Math.abs(distance) < 2) {
        window.scrollTo(0, targetTop)
        scheduleActiveSync()
        return
      }

      if (reducedMotionMedia.matches) {
        window.scrollTo(0, targetTop)
        scheduleActiveSync()
        return
      }

      const duration =
        clamp(
          500
            + Math.abs(distance)
            * 0.11,
          520,
          720,
        )

      const startedAt =
        performance.now()

      locked = true

      function frame(now) {
        const elapsed =
          now - startedAt

        const progress =
          clamp(
            elapsed / duration,
            0,
            1,
          )

        const eased =
          easeOutQuart(progress)

        window.scrollTo(
          0,
          startTop
            + distance
            * eased,
        )

        if (progress < 1) {
          animationFrame =
            window.requestAnimationFrame(
              frame,
            )

          return
        }

        animationFrame = 0

        window.scrollTo(
          0,
          targetTop,
        )

        scheduleActiveSync()

        window.setTimeout(() => {
          locked = false
        }, POST_SNAP_LOCK_MS)
      }

      animationFrame =
        window.requestAnimationFrame(
          frame,
        )
    }

    function resolveSnapTarget(
      direction,
    ) {
      const headerHeight =
        getHeaderHeight()

      const viewportHeight =
        Math.max(
          1,
          window.innerHeight
            - headerHeight,
        )

      const currentIndex =
        findCurrentIndex(
          headerHeight,
        )

      const currentSection =
        sections[currentIndex]

      const currentTop =
        getSectionTop(
          currentSection,
          headerHeight,
        )

      const distanceFromTop =
        window.scrollY
        - currentTop

      const sectionHeight =
        currentSection.offsetHeight

      const sectionBottom =
        currentSection
          .getBoundingClientRect()
          .top
        + window.scrollY
        + sectionHeight

      const viewportBottom =
        window.scrollY
        + window.innerHeight

      const topMagnetZone =
        Math.max(
          88,
          viewportHeight * 0.17,
        )

      const bottomMagnetZone =
        Math.max(
          110,
          viewportHeight * 0.22,
        )

      const sectionFitsViewport =
        sectionHeight
        <= viewportHeight * 1.16

      if (direction > 0) {
        if (
          currentIndex
          >= sections.length - 1
        ) {
          return null
        }

        if (currentIndex === 0) {
          return getSectionTop(
            sections[1],
            headerHeight,
          )
        }

        if (
          sectionFitsViewport &&
          distanceFromTop
            <= topMagnetZone
        ) {
          return getSectionTop(
            sections[
              currentIndex + 1
            ],
            headerHeight,
          )
        }

        const remainingToBottom =
          sectionBottom
          - viewportBottom

        if (
          remainingToBottom
            <= bottomMagnetZone
        ) {
          return getSectionTop(
            sections[
              currentIndex + 1
            ],
            headerHeight,
          )
        }

        return null
      }

      if (currentIndex <= 0) {
        return null
      }

      if (
        distanceFromTop
          <= topMagnetZone
      ) {
        return getSectionTop(
          sections[
            currentIndex - 1
          ],
          headerHeight,
        )
      }

      return null
    }

    function onWheel(event) {
      if (!pointerMedia.matches) {
        return
      }

      if (
        event.ctrlKey ||
        event.metaKey
      ) {
        return
      }

      if (
        isEditableTarget(
          event.target,
        )
      ) {
        return
      }

      if (locked) {
        event.preventDefault()
        return
      }

      if (
        Math.abs(event.deltaX)
        > Math.abs(event.deltaY)
      ) {
        return
      }

      wheelAccumulator +=
        event.deltaY

      if (wheelResetTimer) {
        window.clearTimeout(
          wheelResetTimer,
        )
      }

      wheelResetTimer =
        window.setTimeout(
          resetWheelAccumulator,
          WHEEL_RESET_MS,
        )

      if (
        Math.abs(
          wheelAccumulator,
        ) < WHEEL_THRESHOLD
      ) {
        return
      }

      const direction =
        wheelAccumulator > 0
          ? 1
          : -1

      resetWheelAccumulator()

      const targetTop =
        resolveSnapTarget(
          direction,
        )

      if (targetTop === null) {
        return
      }

      event.preventDefault()

      animateTo(targetTop)
    }

    function onPointerModeChange(
      event,
    ) {
      if (!event.matches) {
        resetWheelAccumulator()
        stopAnimation()
      }
    }

    function onReducedMotionChange(
      event,
    ) {
      if (event.matches) {
        markAllRevealed()
      }
    }

    function onKeyDown(event) {
      if (
        event.key === 'Escape' &&
        locked
      ) {
        stopAnimation()
      }
    }

    window.addEventListener(
      'wheel',
      onWheel,
      {
        passive: false,
      },
    )

    window.addEventListener(
      'scroll',
      scheduleActiveSync,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      scheduleActiveSync,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'keydown',
      onKeyDown,
    )

    pointerMedia.addEventListener(
      'change',
      onPointerModeChange,
    )

    reducedMotionMedia.addEventListener(
      'change',
      onReducedMotionChange,
    )

    syncActiveIndex()

    return () => {
      resetWheelAccumulator()
      stopAnimation()

      if (scrollFrame) {
        window.cancelAnimationFrame(
          scrollFrame,
        )
      }

      revealObserver?.disconnect()

      sections.forEach((section) => {
        section.classList.remove(
          'wf-home-book-section',
          'wf-home-book-section--seen',
        )
      })

      homeRoot.classList.remove(
        'wf-home--research-book',
      )

      window.removeEventListener(
        'wheel',
        onWheel,
      )

      window.removeEventListener(
        'scroll',
        scheduleActiveSync,
      )

      window.removeEventListener(
        'resize',
        scheduleActiveSync,
      )

      window.removeEventListener(
        'keydown',
        onKeyDown,
      )

      pointerMedia.removeEventListener(
        'change',
        onPointerModeChange,
      )

      reducedMotionMedia
        .removeEventListener(
          'change',
          onReducedMotionChange,
        )
    }
  }, [])

  function jumpToSection(index) {
    const section =
      document.getElementById(
        HOME_SECTIONS[index]?.id,
      )

    if (!section) return

    const targetTop =
      getSectionTop(
        section,
        getHeaderHeight(),
      )

    const reducedMotion =
      window.matchMedia(
        REDUCED_MOTION_QUERY,
      ).matches

    window.scrollTo({
      top: targetTop,
      behavior:
        reducedMotion
          ? 'auto'
          : 'smooth',
    })
  }

  return createElement(
    'nav',
    {
      className:
        'wf-home-book-progress',
      'aria-label':
        '홈 섹션 진행 상황',
    },

    createElement(
      'span',
      {
        className:
          'wf-home-book-progress__count',
        'aria-live': 'polite',
      },
      `${String(
        activeIndex + 1,
      ).padStart(2, '0')} / ${String(
        HOME_SECTIONS.length,
      ).padStart(2, '0')}`,
    ),

    createElement(
      'div',
      {
        className:
          'wf-home-book-progress__rail',
      },

      ...HOME_SECTIONS.map(
        (section, index) =>
          createElement(
            'button',
            {
              key: section.id,
              type: 'button',
              className:
                index === activeIndex
                  ? 'wf-home-book-progress__dot is-active'
                  : 'wf-home-book-progress__dot',
              'aria-label':
                `${index + 1}. ${section.label} 섹션으로 이동`,
              'aria-current':
                index === activeIndex
                  ? 'step'
                  : undefined,
              onClick: () =>
                jumpToSection(index),
            },
          ),
      ),
    ),

    createElement(
      'span',
      {
        className:
          'wf-home-book-progress__label',
        'aria-hidden': 'true',
      },
      HOME_SECTIONS[
        activeIndex
      ]?.label ?? '',
    ),
  )
}
