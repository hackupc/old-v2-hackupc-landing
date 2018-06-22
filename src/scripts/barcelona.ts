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
}

class Point{
	x : number;
	y : number;
	constructor(x: number, y: number){
		this.x = x;
		this.y = y;
	}

	toPx():string{
		return this.x + "px, " + this.y + "px";
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
	private readonly _svgSunFileName : string = "assets/img/bg-revers.svg";
	private readonly _svgGroundFileName : string = "assets/img/bg-frontal.svg";
	private readonly _pngFileName : string = "assets/img/bg.png";

	constructor(containerId : string, 
		sunColors : string[],
		skyColors : string[]){
		let self = this;
		this.containerId = containerId;
		if(this.isBrowserSVGCapable())
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
		var factor = Math.max(Math.min(window.pageYOffset / window.innerHeight*1.5, 1), 0);
	    var bg = document.getElementById("background");
	    bg.style.opacity = 1 * (1 - factor)+'';

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
		document.addEventListener('scroll', this.update);
	}

	isBrowserSVGCapable() : boolean{
		return typeof SVGRect !== "undefined";
	}

	//TODO:refactor
	loadSVG(cb) : void{
		let self = this;
		let xhr = new XMLHttpRequest();
		//Async request
		xhr.open("GET", this._svgSunFileName, true);
		xhr.overrideMimeType("image/svg+xml");
		xhr.onload = function (e) {
			if (xhr.readyState === 4) 
			{
				if (xhr.status === 200) 
				{
					var child = document.getElementById(self.containerId)
									.appendChild(xhr.responseXML.documentElement);
					child.id = "sun";
					let xhr2 = new XMLHttpRequest();
					xhr2.open("GET", self._svgGroundFileName, true);
					xhr2.overrideMimeType("image/svg+xml");
					xhr2.onload = function (e) {
						if (xhr2.readyState === 4) 
						{
							if (xhr2.status === 200) 
							{
								var child2 = document.getElementById(self.containerId)
									.appendChild(xhr2.responseXML.documentElement);
								child2.id = "ground";
								if (cb) cb();
							} 
							else 
							{
								console.error("Barcelona (loadSVG-ground):"+xhr2.statusText);
							}
						}
					};
					xhr2.onerror = function (e) {
						console.error("Barcelona (loadSVG-ground):"+xhr2.statusText);
					};
					xhr2.send(null);
				} 
				else 
				{
					console.error("Barcelona (loadSVG-sun):"+xhr.statusText);
				}
			}
		};
		xhr.onerror = function (e) {
			console.error("Barcelona (loadSVG-sun):"+xhr.statusText);
		};
		xhr.send(null);
	}

	loadPNG() : void{
		let img = new Image();
		img.src = this._pngFileName;
		document.getElementById(this.containerId)
			.appendChild(img);
	}


}

document.addEventListener("DOMContentLoaded", function(){
	let b = new Barcelona(
		'background',
		//Sun colors
		['#e22b57', 'rgb(116,20,71)', '#ad0909'],
		//Sky colors
		['#0E8C99', '#fb90ab', '#0b5e94'],
	);
});