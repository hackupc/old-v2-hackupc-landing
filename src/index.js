// import * from './scripts/example';

// import './styles/style.css';
// import './styles/style.sass';
import 'normalize.css';
import './styles/style.scss';


/* ---------- Webfont (asyncronously load fonts) ---------- */
import webfont from 'webfontloader';
 
webfont.load({
	google: {
		families: ['Montserrat:300,400,400i,600,700,800&display=swap']
	}
});
	

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
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

/* ---------- Update hero perspective ---------- */
const heroElem = document.getElementsByClassName('hero-3d-space')[0];
let mouseX = 0;
let mouseY = 0;
let clientAlpha = 0;
let clientBeta = 0;
let clientGamma = 0;
let clientAlphaOrig = 0;
let clientBetaOrig = 0;
let clientGammaOrig = 0;
let perspectiveX = 0;
let perspectiveY = 0;
window.addEventListener('scroll', updateHeroPerspective, {passive: true});
window.addEventListener('mousemove', updateHeroPerspective);
window.addEventListener('deviceorientation', updateHeroPerspective, true);
updateHeroPerspective();
let heroWaitingRefresh = false;

function updateHeroPerspective(event) {
	if(window.pageYOffset <= window.innerHeight && !heroWaitingRefresh) {
		if(event?.clientX) mouseX = event.clientX;
		if(event?.clientY) mouseY = event.clientY;
		if(event?.alpha) clientAlpha = (event.alpha/360 + 0.5)%1;        // alpha [0,360]   -->[0,1]
		if(event?.beta) clientBeta = (event.beta + 180)/360;   // beta  [-180,180]-->[0,1]
		if(event?.gamma) clientGamma = (event.gamma + 90)/180; // gamma [-90,90]  -->[0,1]
		if(clientAlphaOrig === 0 && clientAlpha !== 0) {
			clientAlphaOrig = clientAlpha;
			clientBetaOrig = clientBeta;
			clientGammaOrig = clientGamma;
		}

		heroWaitingRefresh = true;
		window.requestAnimationFrame(() => {
			perspectiveX = 0
			+ window.innerWidth/2 
			+ 1000 * ((clientGamma - clientGammaOrig) % 1 - 0.0) * 2
			+ 1000 * ((clientAlpha - clientAlphaOrig) % 1 - 0.0) * 2
			+ window.innerWidth/50 * Math.atan((window.innerWidth/2 - mouseX) * 2 * Math.PI / window.innerWidth);
			
			perspectiveY = 0
			+ window.pageYOffset 
			+ window.innerHeight / 4 
			+ 1000 * ((clientBeta - clientBetaOrig) % 1 - 0.0) * 2
			+ window.innerHeight/50 * Math.atan((window.innerHeight/2 - mouseY) * 2 * Math.PI / window.innerHeight);

			heroElem.style.perspectiveOrigin = `${perspectiveX}px ${perspectiveY}px`;
			heroWaitingRefresh = false;
		});
	}
}

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

