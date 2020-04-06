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
window.addEventListener('scroll', updateHeroPerspective, {passive: true});
updateHeroPerspective();
let heroWaitingRefresh = false;

function updateHeroPerspective() {
	if(window.pageYOffset <= window.innerHeight && !heroWaitingRefresh) {
		heroWaitingRefresh = true;
		window.requestAnimationFrame(() => {
			heroElem.style.perspectiveOrigin = `50% ${window.pageYOffset + window.innerHeight / 4}px`;
			heroWaitingRefresh = false;
		});
	}
}