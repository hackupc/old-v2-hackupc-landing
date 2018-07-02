/*
	Creates an animated background,
	controlled by the scroll position.
	The SVG file must match the definitions.
	Fallbacks to PNG without animations
	if SVG is not supported.

	Requires
		-chroma-js: handles colors
		-svg file

	Interesting read about color gradients:
	https://www.vis4.net/blog/2013/09/mastering-multi-hued-color-scales/
*/
declare var chroma:any;

class Util{
	/*
		Maps range value q from [a1, b1] to [a2, b2]
	*/
	static mapRange(a1, b1, a2, b2, q):number{
		return (q - a1) * (b2 - a2) / (b1 - a1) + a2;
	}

	/*
		A factory that creates debounced functions.
		A debounced function executes only after
		'wait' ms of the las call.
	*/
	static debounce(func, wait, immediate){
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	/*
	* Loads a file asynchronously
	* if succesfull calls cb(),
	* else calls cberr()
	*/
	static loadFile(sURL, cb, cberr) {
		var oReq = new XMLHttpRequest();
		oReq.onload = function(){
			if (this.readyState === 4) {
				if (this.status === 200) {
					if(typeof cb == "function")
						cb(this);
				} else {
					if(typeof cberr == "function")
						cberr(this);
				}
			}
		};
		oReq.onerror = function(){
			if(typeof cberr == "function")
				cberr(this);
		};
		oReq.open("GET", sURL, true);
		oReq.send(null);
	}
}

class Barcelona{
	containerId : string;
	sunColorInterp : any;
	skyColorInterp : any;
	sunDistance : number;
	stylesheet : CSSStyleSheet;
	private readonly _ssTitle : string = "bg";
	private readonly _sunStyleClass : string = ".st4";
	private readonly _sky1StyleClass : string = ".st0";
	private readonly _sky2StyleClass : string = ".st1";
	private readonly _sky3StyleClass : string = ".st2";
	private readonly _sky4StyleClass : string = ".st3";
	private readonly _sunId : string = "lluna";
	private readonly _skyId : string = "cel";
	private readonly _buttonId : string = "boto";
	private readonly _registerUrl : string = "https://my.hackupc.com";
	private readonly _svgSunFileName : string = "assets/img/bg-revers.svg";
	private readonly _svgGroundFileName : string = "assets/img/bg-frontal.svg";
	private readonly _pngFileName : string = "assets/img/bg-fallback.png";
	private readonly _phoneBgFileName : string = "assets/img/bg-fallback-phone.png";


	constructor(containerId : string, 
		sunColors : string[],
		skyColors : string[]){
		let self = this;
		this.containerId = containerId;
		if(this.isPhone())
		{
			this.loadPhoneBg()
		}
		else if(this.isBrowserSVGCapable())
		{
			this.loadSVG(function(){
				self.sunColorInterp = chroma.bezier(sunColors);
				self.skyColorInterp = chroma.bezier(skyColors);
				self.setListener();
				self.getStyleSheet();
			});
		}
		else
		{
			this.loadPNG();
		}
	};


	update = (e) => {
		var factor = Math.max(Math.min(window.pageYOffset / window.innerHeight, 1), 0);
		var bg = document.getElementById("background");
		bg.style.opacity = 1 * (1 - factor)+'';
		//bg.style.transform = "scale(" + (1 + factor) + ")";

		//Get normalized scroll position
		let scrollTop : number = window.pageYOffset;
		let q : number = Util.mapRange(
			//From
			//0, document.body.scrollHeight, 
			0, window.innerHeight/1.5, 
			//To
			0, 1, 
			//Input
			scrollTop
		);

		//Set interpolated sun color
		let sunColor : string = this.sunColorInterp(q).hex();
		this.setFillColor(this._sunStyleClass, sunColor);

		//Set interpolated sky color
		let mainSkyColor : any = this.skyColorInterp(q);
		this.setFillColor(this._sky1StyleClass, mainSkyColor.hex());
		this.setFillColor(this._sky2StyleClass, mainSkyColor.brighten(0.4).hex());
		this.setFillColor(this._sky3StyleClass, mainSkyColor.brighten(0.8).hex());
		this.setFillColor(this._sky4StyleClass, mainSkyColor.brighten(1.2).hex());
		//Apply also to page background
		document.getElementById("sky-extension").style.backgroundColor = mainSkyColor.hex();
		
	}

	isPhone() : boolean{
		return (window.innerWidth < 700);
	}
	/*
		Get a reference to the SVG's stylesheet
	*/
	getStyleSheet() : void{
		for(let i = 0; i < document.styleSheets.length; i++)
		{
			if(document.styleSheets[i].title == this._ssTitle)
			{
				this.stylesheet = <CSSStyleSheet>document.styleSheets[i];
				return;
			}
		}
	}

	/*
	 Changes the fill style for the class cls with color clr
	*/
	setFillColor(cls:string, clr:string) : void{
		for(let i = 0; i < this.stylesheet.cssRules.length; i++)
		{
			let rule = <CSSStyleRule>this.stylesheet.cssRules[i];
			if(rule.selectorText == cls)
			{
				rule.style.fill = clr;
			}
		}
	}
	setListener() : void{
		let self = this;
		document.addEventListener('scroll', this.update);
		document.getElementById(this._buttonId).addEventListener('click', function(){
			window.open(self._registerUrl);
		});
	}

	isBrowserSVGCapable() : boolean{
		return typeof SVGRect !== "undefined";
		//return false;
	}

	loadSVG(cb) : void{
		let self = this;
		let error = (id)=>{
			console.error("Error while loading background '"+id+"'");
		};

		let loaded = false;
		let container = document.getElementById(self.containerId);
		Util.loadFile(this._svgSunFileName, (xhr)=>{
			var child = container.insertBefore(xhr.responseXML.documentElement, null);
			child.id = 'sun';
			if(loaded && cb) cb()
			loaded = true
		},()=>{error('sun')});

		Util.loadFile(this._svgGroundFileName, (xhr2)=>{
			var child = container.appendChild(xhr2.responseXML.documentElement)
			child.id = 'ground';
			if(loaded && cb) cb()
			loaded = true
		},()=>{error('ground')});
	}

	loadPNG() : void{
		let img = new Image();
		img.src = this._pngFileName;
		let self = this;
		document.getElementById(this.containerId)
			.appendChild(img)
			.addEventListener('click', function(){
				window.open(self._registerUrl)
			});
	}
	loadPhoneBg() : void{
		let img = new Image();
		img.src = this._phoneBgFileName;
		let self = this;
		document.getElementById(this.containerId)
			.appendChild(img)
			.addEventListener('click', function(){
				window.open(self._registerUrl)
			});
	}


}

document.addEventListener("DOMContentLoaded", function(){
	let b = new Barcelona(
		'background',
		//Sun colors
		['#e22b57', 'rgb(116, 43, 19)', '#ad0909'],
		//Sky colors rgb(146, 60, 66)
		['#0E8C99', 'rgb(165, 68, 52)', 'rgb(146, 60, 66)', '#0b5e94', '#0b5e94'],
	);
});