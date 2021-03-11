Promise.all([import('analytics'), import('@analytics/google-analytics')]).then(
  ([{ default: Analytics }, { default: googleAnalytics }]) => {
    const analytics = Analytics({
      app: 'hackupc-landing',
      plugins: [
        googleAnalytics({
          trackingId: 'UA-69542332-1',
          anonymizeIp: true,
        }),
      ],
    })

    document.querySelectorAll('[data-ga-apply-button]').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        const clickedElem = event.target as HTMLButtonElement | null
        const data = clickedElem?.dataset?.location

        if (data) {
          analytics.track('applyed', {
            category: 'Apply',
            label: 'Apply button clicked',
            value: data,
          })
        }
      })
    })

    document.querySelectorAll('[data-ga-nav-item]').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        const clickedElem = event.target as HTMLAnchorElement | null
        const data = clickedElem?.href

        if (data) {
          analytics.track('navbar-clicked', {
            category: 'Navigation',
            label: 'Navbar link clicked',
            value: data,
          })
        }
      })
    })

    document.querySelectorAll('.faq__title').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        const clickedElem = event.target as HTMLElement | null

        if (clickedElem && !clickedElem.dataset.clicked) {
          clickedElem.dataset.clicked = 'true'

          analytics?.track('faq-expanded', {
            category: 'FAQ',
            label: 'FAQ question expanded',
            value: clickedElem.textContent?.trim() ?? '',
          })
        }
      })
    })
  }
)

// window.dataLayer = window.dataLayer || [];
// function gtag(){
// 	dataLayer.push(arguments);
// }
// gtag('js', new Date());
// gtag('config', 'UA-69542332-1');
