declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

const GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-WFBH19BZ64'

if (process.env.NODE_ENV === 'production') {
  const script = window.document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`
  const elem = window.document.getElementsByTagName('script')[0]
  elem.parentNode?.insertBefore(script, elem)
}

window.dataLayer = window.dataLayer || []
const gtag: Gtag.Gtag = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Emmited event to Google Analytics:', args)
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.dataLayer.push(arguments)
}
gtag('js', new Date())
gtag('config', GOOGLE_ANALYTICS_MEASUREMENT_ID, { anonymize_ip: true })

export { gtag, GOOGLE_ANALYTICS_MEASUREMENT_ID }
