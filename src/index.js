// import * from './scripts/example';

// import './styles/style.css';
// import './styles/style.sass';
import 'normalize.css';
import './styles/style.scss';

import('focus-visible');
import webfont from 'webfontloader';

/* ---------- Webfont (asyncronously load fonts) ---------- */

webfont.load({
	google: {
		families: ['Montserrat:400,400i,600,700,800,800i&display=swap']
	}
});

/* ---------- Google Analytics ---------- */

Promise.all([
	import('analytics'),
	import('@analytics/google-analytics'),
]).then(([
	{ default: Analytics }, 
	{ default: googleAnalytics },
]) => {

	const analytics = Analytics({
		app: 'hackupc-landing',
		plugins: [
			googleAnalytics({
				trackingId: 'UA-69542332-1',
				anonymizeIp: true,
			})
		]
	});
		
	document.querySelectorAll('[data-ga-apply-button]').forEach((elem) => {
		elem.addEventListener('click', (event) => {
			const data = event.target.dataset;
		
			analytics.track('applyed', {
				category: 'Apply',
				label: 'Apply button clicked',
				value: data.location,
			});
		});
	});

	document.querySelectorAll('[data-ga-nav-item]').forEach((elem) => {
		elem.addEventListener('click', (event) => {
			analytics.track('navbar-clicked', {
				category: 'Navigation',
				label: 'Navbar link clicked',
				value: event.target.href,
			});
		});
	});

});


// window.dataLayer = window.dataLayer || [];
// function gtag(){
// 	dataLayer.push(arguments);
// }
// gtag('js', new Date());
// gtag('config', 'UA-69542332-1');

/* ---------- Lax.js ---------- */
// import lax from 'lax.js'

// window.onload = function() {
// 	lax.setup() // init

// 	const updateLax = () => {
// 		lax.update(window.scrollY)
// 		window.requestAnimationFrame(updateLax)
// 	}

// 	window.requestAnimationFrame(updateLax)
// }

/* ---------- Real vh ---------- */
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

// We listen to the resize event
// window.addEventListener('resize', () => {
//   // We execute the same script as before
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);
// });

/* ---------- Update hero perspective ---------- */
const heroElem = document.getElementsByClassName('hero-3d-space')[0];
const applyElem = document.getElementsByClassName('apply-button')[0];
let mouseX = 0.5;
let mouseY = 0.5;

let alpha = 0.5;
let beta = 0.5;
let gamma = 0.5;

let alphaOrig = 0.5;
let betaOrig = 0.5;
let gammaOrig = 0.5;

let perspectiveX = window.innerWidth/2;
let perspectiveY = window.innerHeight * 0.125;

let translateZ = false;

let heroWaitingRefresh = false;

window.addEventListener('scroll', updateHeroPerspective, {passive: true});
window.addEventListener('mousemove', updateHeroPerspective);
window.addEventListener('resize', updateHeroPerspective);
updateHeroPerspective();

// iOS 13+ device orientation requestPermission
if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
	heroElem.addEventListener('click', (event) => {
		if(event.currentTarget !== applyElem){
			window.DeviceOrientationEvent.requestPermission()
			.then(permissionState => {
				if (permissionState === 'granted') {
					window.addEventListener('deviceorientation', updateHeroPerspective, false);
				}
			}).catch(console.error);
		}
	});
} else {
	window.addEventListener('deviceorientation', updateHeroPerspective, false);
}

document.addEventListener('visibilitychange', () => {
	alphaOrig = 0.5;
	betaOrig  = 0.5;
	gammaOrig = 0.5;
});

function updateHeroPerspective(event) {
	if(window.pageYOffset <= window.innerHeight && !heroWaitingRefresh) {
		if(event){
			// alpha [0,360]  -->[0,1]
			// beta  [-180,180]-->[0,1]
			// gamma [-90,90] -->[0,1]
			
			let newMouseX = mod(event.clientX/window.innerWidth); 
			let newMouseY = mod(event.clientY/window.innerHeight); 
			let newAlpha  = mod(event.alpha/360 + 0.5); 
			let newBeta   = mod((event.beta + 180)/360 - 0.125); 
			let newGamma  = mod((event.gamma + 90)/180); 

			mouseX = smooth(newMouseX, mouseX);
			mouseY = smooth(newMouseY, mouseY);
			alpha  = smooth(newAlpha,  alpha);
			beta   = smooth(newBeta,   beta);
			gamma  = smooth(newGamma,  gamma);

			if(!isNaN(newAlpha) && alphaOrig === 0.5){ alpha = newAlpha; alphaOrig = newAlpha; }
			if(!isNaN(newBeta ) && betaOrig  === 0.5){ beta  = newBeta;  betaOrig  = newBeta;  }
			if(!isNaN(newGamma) && gammaOrig === 0.5){ gamma = newGamma; gammaOrig = newGamma; }
		}

		heroWaitingRefresh = true;
		window.requestAnimationFrame(() => {
			perspectiveX = 0
			+ window.innerWidth/2 
			+ 250 * magnet((mod(alpha - alphaOrig + 0.5) - 0.5) * 2)
			+ 250 * magnet((mod(gamma - gammaOrig + 0.5) - 0.5) * 2)
			+ -window.innerWidth/40 * magnet((mouseX - 0.5) * 2)
			
			let height = Math.min(900, window.innerHeight);
			perspectiveY = 0
			+ window.pageYOffset 
			+ height * 0.125
			+ 500 * magnet((mod(beta - betaOrig + 0.5) - 0.5) * 2)
			+ -height/40 * magnet((mouseY - 0.6667) * 2)

			heroElem.style.perspectiveOrigin = `${perspectiveX}px ${perspectiveY}px`;
      heroElem.style.transform = `translateZ(${(translateZ = !translateZ) ? 1 : 0}px)`; // Fix firefox and safari
			heroWaitingRefresh = false;
		});
	}
}

function mod(n,m=1){
	return ((n % m) + m) % m;
}
function magnet(x=0.5) {
	return Math.sin(Math.PI/2*x);
}

function smooth(final, initial=0) {
	if(isNaN(final)) return initial;

	let dif = final - initial;
	let s = dif >= 0 ? +1 : -1;
	return (initial + s * dif**2);
}
// function smooth(final, initial=0) {
// 	let dif = final - initial;
// 	if(dif < 0.01 && dif > -0.01) return initial;
// 	else return (initial + dif);
// }
// function smooth(final, initial=0) {
// 	let dif = final - initial;
// 	dif = Math.min(dif, 0.1)
// 	dif = Math.max(dif, -0.1)
// 	return (initial + dif);
// }
// function smooth(final, initial=0) {
//   return (initial + final)/2;
// }
// function smooth(final, initial=0) {
//   return final;
// }

/* ---------- Cookies ---------- */
const cookieNotice = document.getElementById('gdpr');

if (window.localStorage.getItem('cookies') !== '1') {
	cookieNotice.classList.remove('gdpr--hidden');
}

const cookieNoticeClose = document.getElementById('gdpr-close');
cookieNoticeClose.addEventListener('click', () => {
	window.localStorage.setItem('cookies', '1');
	cookieNotice.classList.add('gdpr--hidden');

	cookieNotice.style.display = 'flex';
	setTimeout(() => {
		cookieNotice.style.display = null;
	}, 400);
})

/* ---------- Animations ---------- */

// Animation Lamp
const lampOnElem = document.getElementById('lamp-on');
let lampIsOn = 1;
lampOnElem.addEventListener('mousedown', event => {
	lampIsOn = !lampIsOn;
	lampOnElem.style.opacity = lampIsOn + 0;
});

// Animation countdown
const countdownNumElem = {
	day:    document.querySelector('.countdown__cell[data-unit="day"] .countdown__number'),
	hour:   document.querySelector('.countdown__cell[data-unit="hour"] .countdown__number'),
	minute: document.querySelector('.countdown__cell[data-unit="minute"] .countdown__number'),
	second: document.querySelector('.countdown__cell[data-unit="second"] .countdown__number'),
}
const countdownPluralElem = {
	day:    document.querySelector('.countdown__cell[data-unit="day"] .countdown__label-plural'),
	hour:   document.querySelector('.countdown__cell[data-unit="hour"] .countdown__label-plural'),
	minute: document.querySelector('.countdown__cell[data-unit="minute"] .countdown__label-plural'),
	second: document.querySelector('.countdown__cell[data-unit="second"] .countdown__label-plural'),
}

const countdownDate = new Date(2020,9,11,19,0,0); // Notice: January is 0 and December 11
let secondsLeft = Math.floor((countdownDate - new Date()) / 1000);

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

function updateCountdown() {
	if(secondsLeft > 0){

		secondsLeft -= 1;

		countdownNumElem.day.textContent    = Math.floor(secondsLeft / 60 / 60 / 24);
		countdownNumElem.hour.textContent   = Math.floor(secondsLeft / 60 / 60) % 24;
		countdownNumElem.minute.textContent = Math.floor(secondsLeft / 60) % 60;
		countdownNumElem.second.textContent = Math.floor(secondsLeft) % 60;		

		countdownPluralElem.day.style.display    = countdownNumElem.day.textContent === '1' ? 'none' : 'inline-block';
		countdownPluralElem.hour.style.display   = countdownNumElem.hour.textContent === '1' ? 'none' : 'inline-block';
		countdownPluralElem.minute.style.display = countdownNumElem.minute.textContent === '1' ? 'none' : 'inline-block';
		countdownPluralElem.second.style.display = countdownNumElem.second.textContent === '1' ? 'none' : 'inline-block';


	}else{
		clearInterval(countdownInterval);
	}
}


// Animation rocket

const rocketElem = document.querySelector('.object--rocket');
let rocketOn = 1;
rocketElem.addEventListener('click', event => {
	if(rocketElem.classList.contains('stop-animation')){
		rocketElem.classList.remove('stop-animation');
		setTimeout(() => {
			rocketElem.classList.add('stop-animation');
		}, (4+3+1+1) * 1000);
	}
});

// Animation duck

const duckElem = document.getElementsByClassName('object--rubber-duck')[0];
const duckSilhouetteElem = document.getElementsByClassName('wanted__duck-silhouette--missing')[0];
const duckSignElem = document.getElementsByClassName('wanted__sign')[0];
const duckListElem = document.getElementsByClassName('wanted__list')[0];
const duckImageElem = document.getElementsByClassName('rubber-duck-img')[0];
const cowsayImageElem = document.getElementsByClassName('cowsay__image')[0];

// Only display duck if the screen infront is visible
if(cowsayImageElem.complete){
	duckImageElem.style.display = 'block'
}else{
	cowsayImageElem.addEventListener('load', () => {
		duckImageElem.style.display = 'block'
	})
}

duckElem.addEventListener('click', (event) => {
	duckElem.classList.add('duck-cliked');
	duckElem.style.pointerEvents = 'none';
	setTimeout(() => {
		duckSilhouetteElem.classList.remove('wanted__duck-silhouette--missing')
		duckSilhouetteElem.classList.add('wanted__duck-silhouette--found')
		duckListElem.style.pointerEvents = 'none';
		setTimeout(() => {
			duckSignElem.textContent = 'FOUND';
		}, 200);
	}, 1000);
});

// Plot animation 

const plotLinesSteps = 5;
const plotWidth = 200;
const plotHandle = Math.floor(plotWidth/plotLinesSteps/3);

const plotLines = [
	document.getElementsByClassName('plot__plot-line--1')[0],
	document.getElementsByClassName('plot__plot-line--2')[0],
	document.getElementsByClassName('plot__plot-line--3')[0],
	document.getElementsByClassName('plot__plot-line--4')[0],
];
const barContents = [
	document.getElementsByClassName('plot__bar-content--1')[0],
	document.getElementsByClassName('plot__bar-content--2')[0],
	document.getElementsByClassName('plot__bar-content--3')[0],
	document.getElementsByClassName('plot__bar-content--4')[0],
];

for (const i in plotLines) {
	animatePlotLine(i);
}

function animatePlotLine(i){
	plotLines[i].style.d = `path("${generatePattern()}")`;
	barContents[i].style.transform = `scaleY(${Math.random()})`;

	setTimeout(() => {
		animatePlotLine(i);
	}, Math.random()*5000+5500);
}

function generatePattern(){
	// If you want to understand whow the curve is build read this article:
	// https://css-tricks.com/svg-path-syntax-illustrated-guide/

	let pattern = `M${plotWidth},${Math.floor(Math.random()*100.99)}`;

	for (let i = plotLinesSteps-1; i >= 0 ; i--) {
		let x = Math.floor(plotWidth/plotLinesSteps*i);
		let y = Math.floor(Math.random()*100.99);

		pattern += ` S${x+plotHandle},${y} ${x},${y}`;
	}
	return pattern;
}

// FAQ

const faqQuestionTitleElems = document.querySelectorAll('.faq__question-title');

 document.querySelectorAll('.faq__question-answer[aria-hidden="true"] a').forEach((linkElem) => {
	linkElem.tabIndex = -1;
});

for (const faqQuestionTitleElem of faqQuestionTitleElems) {	
	faqQuestionTitleElem.addEventListener('click', function(event) {
		const faqQuestionElem = this.closest('.faq__question');
		const faqAnswerElem = faqQuestionElem.querySelector('.faq__question-answer');
		// const faqLinksElems = faqQuestionElem.querySelectorAll('a');

    if (faqQuestionTitleElem.getAttribute('aria-expanded') === 'true') {
			faqQuestionElem.classList.remove('faq__question--expanded');
			faqQuestionTitleElem.setAttribute('aria-expanded', 'false');
			faqAnswerElem.setAttribute('aria-hidden', 'true');
			faqAnswerElem.style.maxHeight = null;
			
		 faqAnswerElem.querySelectorAll('a').forEach((linkElem) => {
				linkElem.tabIndex = -1;
			});
    } else {
			faqQuestionElem.classList.add('faq__question--expanded');
			faqAnswerElem.setAttribute('aria-hidden', 'false');
			faqQuestionTitleElem.setAttribute('aria-expanded', 'true');
			faqAnswerElem.style.maxHeight = `${faqAnswerElem.scrollHeight}px`;

		 faqAnswerElem.querySelectorAll('a').forEach((linkElem) => {
				linkElem.tabIndex = null;
			});
		}
		
		if(!faqQuestionTitleElem.dataset.clicked) {
			faqQuestionTitleElem.dataset.clicked = true;

			analytics.track('faq-expanded', {
				category: 'FAQ',
				label: 'FAQ question expanded',
				value: faqQuestionTitleElem.textContent.trim(),
			});
		}
	});
}
