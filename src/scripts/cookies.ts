// const cookieText = 'This website uses cookies of its own and of third parties to improve your browsing experience and show you personalized content based on your interests. If you continue browsing, we consider that you accept its use. You can obtain more information in our <a class="cookie-notice__link" href="/privacy_and_cookies" target="_blank">Privacy and Cookies Policy</a>'
const cookieText = 'This website uses cookies on your device to analyze site usage <a class="cookie-notice__link" href="/privacy_and_cookies" target="_blank">Privacy and Cookies Policy</a>'
const cookieNotice = document.createElement('div')
cookieNotice.innerHTML = `<p class="cookies-notice__text">${cookieText}</p><button class="cookies-notice__button" onclick="acceptCookies()">OK</button>`
cookieNotice.classList.add('cookies-notice')

if (window.localStorage.getItem('cookiesAccepted') !== 'true') {
  if (document.readyState !== 'loading') {    
    document.body.appendChild(cookieNotice)
  }else{
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(cookieNotice)
    })
  }
}

function acceptCookies () {
  window.localStorage.setItem('cookiesAccepted', 'true')
  cookieNotice.classList.add('cookies-notice--hidden')
}
