const cookieNotice = document.getElementById('gdpr')

if (cookieNotice) {
  if (window.localStorage.getItem('cookies') !== '1') {
    cookieNotice.classList.remove('gdpr--hidden')
  }

  const cookieNoticeClose = document.getElementById('gdpr-close')
  cookieNoticeClose?.addEventListener('click', () => {
    window.localStorage.setItem('cookies', '1')
    cookieNotice.classList.add('gdpr--hidden')

    cookieNotice.style.display = 'flex'
    setTimeout(() => {
      cookieNotice.style.display = ''
    }, 400)
  })
}
