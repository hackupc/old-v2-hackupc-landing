const cookieText = 'This website uses cookies of its own and of third parties to improve your browsing experience and show you personalized content based on your interests. If you continue browsing, we consider that you accept its use. You can obtain more information in our <a class="cookie-notice__link" href="/privacy_and_cookies" target="_blank">Privacy and Cookies Policy</a>'
// const cookieText = 'This website uses cookies to ensure you get the best experience <a class="cookie-notice__link" href="/privacy_and_cookies" target="_blank">More info</a>'
// const cookieText = 'This website uses cookies to analyze site usage. <a class="cookie-notice__link" href="/privacy_and_cookies" target="_blank">Privacy and Cookies Policy</a>'
// const cookieText = 'We uses cookies to analyze site usage. <a class="cookie-notice__link" href="/privacy_and_cookies" target="_blank">More info</a>'
// const cookieText = 'By using our site you accept our use of cookies. <a class="cookie-notice__link" href="/privacy_and_cookies" target="_blank">More info</a>'
const cookieNotice = document.createElement('div')
cookieNotice.innerHTML = `<p class="cookies-notice__text">${cookieText}</p><button class="cookies-notice__button" onclick="acceptCookies()" title="Close">OK</button>`
cookieNotice.classList.add('cookies-notice')

if (window.localStorage.getItem('cookies') !== '1') {
	if (document.readyState !== 'loading') {
		document.body.appendChild(cookieNotice)
	} else {
		document.addEventListener('DOMContentLoaded', function () {
			document.body.appendChild(cookieNotice)
		})
	}
}

// eslint-disable-next-line no-unused-vars
function acceptCookies () {
	window.localStorage.setItem('cookies', '1')
	cookieNotice.classList.add('cookies-notice--hidden')
}
