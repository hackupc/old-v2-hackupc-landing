import { gtag } from './analytics-init'

const applyButtons: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
  '[data-ga-apply-button]'
)
applyButtons.forEach((elem) => {
  elem.addEventListener(
    'click',
    () => {
      gtag('event', 'applyed', {
        category: 'Apply',
        label: 'Apply button clicked',
        value: elem.dataset.location,
      })
    },
    { passive: true }
  )
})

const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
  '[data-ga-nav-item]'
)
navLinks.forEach((elem) => {
  elem.addEventListener(
    'click',
    () => {
      gtag('event', 'navbar-clicked', {
        category: 'Navigation',
        label: 'Navbar link clicked',
        value: elem.href,
      })
    },
    { passive: true }
  )
})

const faqTitles: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
  '.faq__title'
)
faqTitles.forEach((elem) => {
  elem.addEventListener(
    'click',
    () => {
      if (!elem.dataset.clicked) {
        elem.dataset.clicked = 'true'

        gtag('event', 'faq-expanded', {
          category: 'FAQ',
          label: 'FAQ question expanded',
          value: elem.textContent?.trim() ?? '',
        })
      }
    },
    { passive: true }
  )
})
