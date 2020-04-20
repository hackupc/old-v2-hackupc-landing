// import * from './scripts/example';

// import './styles/style.css';
// import './styles/style.sass';
import 'normalize.css';
import './styles/style.scss';


/* ---------- Webfont (asyncronously load fonts) ---------- */
import webfont from 'webfontloader';
 
webfont.load({
	google: {
		families: ['Montserrat:400,400i,600,700,800&display=swap']
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

window.addEventListener('scroll', updateHeroPerspective, {passive: true});
window.addEventListener('mousemove', updateHeroPerspective);
window.addEventListener('resize', updateHeroPerspective);
updateHeroPerspective();
let heroWaitingRefresh = false;

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
			
			perspectiveY = 0
			+ window.pageYOffset 
			+ window.innerHeight * 0.125
			+ 500 * magnet((mod(beta - betaOrig + 0.5) - 0.5) * 2)
			+ -window.innerHeight/40 * magnet((mouseY - 0.6667) * 2)

			heroElem.style.perspectiveOrigin = `${perspectiveX}px ${perspectiveY}px`;
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
duckElem.addEventListener('click', (event) => {
	duckElem.classList.add('duck-cliked');
	duckElem.classList.remove('clickable');
	setTimeout(() => {
		duckSilhouetteElem.classList.remove('wanted__duck-silhouette--missing')
		duckSilhouetteElem.classList.add('wanted__duck-silhouette--found')
		duckListElem.classList.remove('clickable');
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
