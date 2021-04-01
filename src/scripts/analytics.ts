const GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-WFBH19BZ64'

if (process.env.NODE_ENV === 'production') {
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`
  document.body.append(script)
} else {
  gtag = (...args: unknown[]) => {
    console.log('Emmited event to Google Analytics:', args)
  }
}

gtag('js', new Date())
gtag('config', GOOGLE_ANALYTICS_MEASUREMENT_ID, { anonymize_ip: true })
gtag('set', { hackupc_edition: '2021' })

const applyButtons: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
  '[data-ga-apply-button]'
)
applyButtons.forEach((elem) => {
  elem.addEventListener(
    'click',
    () => {
      gtag('event', 'apply', {
        category: 'Apply',
        label: 'Apply button clicked',
        role: elem.dataset.role,
        location: elem.dataset.location,
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
      gtag('event', 'navbar-click', {
        category: 'Navigation',
        label: 'Navbar link clicked',
        location: elem.href,
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

        gtag('event', 'faq_expand', {
          category: 'FAQ',
          label: 'FAQ question expanded',
          question: elem.textContent?.trim() ?? '',
        })
      }
    },
    { passive: true }
  )
})
