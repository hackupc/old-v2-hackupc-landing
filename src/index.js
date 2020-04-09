// import * from './scripts/example';

// import './styles/style.css';
// import './styles/style.sass';
import 'normalize.css';
import './styles/style.scss';


/* ---------- Lax.js ---------- */
import lax from 'lax.js'

window.onload = function() {
	lax.setup() // init

	const updateLax = () => {
		lax.update(window.scrollY)
		window.requestAnimationFrame(updateLax)
	}

	window.requestAnimationFrame(updateLax)
}

/* ---------- Real vh ---------- */
// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

/* ---------- Update hero perspective ---------- */
const heroElem = document.getElementsByClassName('section--hero')[0];
let mouseX = 0;
let mouseY = 0;
// let clientBeta = 0;
// let clientAlpha = 0;
let perspectiveX = 0;
let perspectiveY = 0;
window.addEventListener('scroll', updateHeroPerspective, {passive: true});
window.addEventListener('mousemove', updateHeroPerspective, {passive: true});
// window.addEventListener("deviceorientation", updateHeroPerspective, true);
updateHeroPerspective();
let heroWaitingRefresh = false;

function updateHeroPerspective(event) {
	if(window.pageYOffset <= window.innerHeight && !heroWaitingRefresh) {
		if(event?.clientX !== undefined) mouseX = event.clientX;
		if(event?.clientY !== undefined) mouseY = event.clientY;
		// if(event?.beta !== undefined) clientBeta = event.beta; // Y (rotation axis X)
		// if(event?.beta !== undefined) clientAlpha = event.alpha; // X (rotation axis Y)
		
		heroWaitingRefresh = true;
		window.requestAnimationFrame(() => {
			perspectiveX = 0
			+ window.innerWidth/2 
			+ window.innerWidth/50 * Math.atan((window.innerWidth/2 - mouseX) * 2 * Math.PI / window.innerWidth);

			perspectiveY = 0
			+ window.pageYOffset 
			+ window.innerHeight / 4 
			+ window.innerHeight/50 * Math.atan((window.innerHeight/2 - mouseY) * 2 * Math.PI / window.innerHeight);

			heroElem.style.perspectiveOrigin = `${perspectiveX}px ${perspectiveY}px`;
			heroWaitingRefresh = false;
		});
	}
}

/* ---------- Animations ---------- */
const lampOnElem = document.getElementById('lamp-on');
let lampIsOn = 1;
lampOnElem.addEventListener('mousedown', event => {
	lampIsOn = !lampIsOn;
	lampOnElem.style.opacity = lampIsOn + 0;
});
